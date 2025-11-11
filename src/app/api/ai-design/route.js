import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const OPENAI_MODEL = 'gpt-4o-mini' // or 'gpt-3.5-turbo' for cheaper option

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    plotW: { type: 'number' },
    plotL: { type: 'number' },
    floors: { type: 'integer' },
    floorH: { type: 'number' },
    roofType: { type: 'string', enum: ['gable', 'hip', 'shed', 'flat'] },
    color: { type: 'string' },
    floodRisk: { type: 'boolean' },
    softSoil: { type: 'boolean' },
    style: {
      type: 'string',
      enum: [
        'modern',
        'contemporary',
        'classic',
        'loft',
        'nordic',
        'minimal',
        'thai_oriental',
        'colonial',
        'natural',
        'tropical',
        'vintage',
        'luxury',
        'retro',
        'thai'
      ]
    },
    rationale: { type: 'string' },
  },
  required: ['plotW', 'plotL', 'floors', 'floorH', 'roofType', 'color', 'floodRisk', 'softSoil', 'style', 'rationale']
}

const systemPrompt = `คุณคือผู้ช่วยออกแบบบ้านที่ตอบกลับเป็น JSON เท่านั้น
- อ่านความต้องการผู้ใช้
- แปลงเป็นคอนฟิกสำหรับหน้า Designer
- ห้ามตอบข้อความอื่นนอกจาก JSON`

export async function POST(request) {
  try {
    // Check API key
    const apiKey = process.env.OPENAI_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length)
    console.log('API Key starts with:', apiKey?.substring(0, 10))
    
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const prompt = body?.prompt?.trim()

    if (!prompt) {
      return NextResponse.json(
        { ok: false, error: 'Empty prompt' },
        { status: 400 }
      )
    }

    // Call OpenAI with retries
    let lastError = null
    let attempt = 0
    const maxAttempts = 3

    while (attempt < maxAttempts) {
      attempt++
      
      try {
        const completion = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'HouseDesign',
              strict: true,
              schema: schema
            }
          },
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
        })

        const content = completion.choices[0]?.message?.content
        if (!content) {
          throw new Error('No content in response')
        }

        const data = JSON.parse(content)
        
        return NextResponse.json({
          ok: true,
          data,
          attempt
        })

      } catch (error) {
        lastError = error.message
        console.error('OpenAI API Error:', error)
        console.error('Error status:', error.status)
        console.error('Error message:', error.message)
        
        // Check if error is retryable
        if (error.status && [408, 429, 500, 502, 503, 504].includes(error.status)) {
          // Exponential backoff
          const sleepMs = 600 * Math.pow(2, attempt - 1)
          await new Promise(resolve => setTimeout(resolve, sleepMs))
          continue
        } else {
          // Non-retryable error
          break
        }
      }
    }

    // All attempts failed
    console.error('All attempts failed. Last error:', lastError)
    return NextResponse.json(
      { ok: false, error: lastError || 'Request failed after retries', details: 'Check server logs' },
      { status: 502 }
    )

  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }
}
