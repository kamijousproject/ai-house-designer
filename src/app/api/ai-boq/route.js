import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = 'gpt-4o-mini'

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    items: {
      type: 'array',
      minItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          qty: { type: 'number' },
          unit: { type: 'string' },
          rate: { type: 'number' }
        },
        required: ['name','qty','unit','rate']
      }
    }
  },
  required: ['items']
}

const systemPrompt = `คุณเป็นผู้ช่วยวิศวกรถอดปริมาณงาน (BOQ) สำหรับบ้านพักอาศัยในไทย ตอบกลับเฉพาะ JSON ตาม schema เท่านั้น
- พิจารณาขนาดอาคาร, จำนวนชั้น, ความสูงชั้น, รูปแบบหลังคา, สภาพดิน/น้ำท่วม, และสไตล์บ้าน
- กำหนดงานหลักโดยประมาณ เช่น โครงสร้าง, หลังคา, ผนัง, ปูน/ทราย/หิน, ฉาบ, ปูพื้น, สี, ประตูหน้าต่าง, ระบบไฟฟ้า/ประปา
- ระบุปริมาณ (qty) และหน่วย (unit) ที่เหมาะสม เช่น ตร.ม., ลบ.ม., ตัน, ชุด
- rate ให้เป็นราคา/หน่วยโดยประมาณ (บาท)
- หลีกเลี่ยงตัวหนังสืออื่นนอกเหนือจาก JSON`

export async function POST(request){
  try{
    if(!process.env.OPENAI_API_KEY){
      return NextResponse.json({ ok:false, error:'OPENAI_API_KEY not configured' }, { status:500 })
    }

    const body = await request.json().catch(()=>({}))
    const prompt = (body?.prompt || '').trim()
    const cfg = body?.cfg || {}

    if(!prompt && !cfg){
      return NextResponse.json({ ok:false, error:'Missing prompt or config' }, { status:400 })
    }

    const userContent = `โจทย์: ${prompt || 'สร้าง BOQ จากพารามิเตอร์'}\n`+
      `พารามิเตอร์: plotW=${cfg.plotW||''}, plotL=${cfg.plotL||''}, floors=${cfg.floors||''}, floorH=${cfg.floorH||''}, `+
      `roofType=${cfg.roofType||''}, style=${cfg.styleSel||''}, floodRisk=${cfg.floodRisk?'true':'false'}, softSoil=${cfg.softSoil?'true':'false'}`

    let lastError=null
    for(let attempt=1; attempt<=3; attempt++){
      try{
        const completion = await openai.chat.completions.create({
          model: MODEL,
          response_format: { type:'json_schema', json_schema:{ name:'AI_BOQ', strict:true, schema } },
          temperature: 0.2,
          messages: [
            { role:'system', content: systemPrompt },
            { role:'user', content: userContent }
          ]
        })
        const content = completion.choices?.[0]?.message?.content
        if(!content) throw new Error('Empty content')
        const data = JSON.parse(content)
        return NextResponse.json({ ok:true, data, attempt })
      }catch(err){
        lastError = err?.message || 'error'
        if(err?.status && [408,429,500,502,503,504].includes(err.status)){
          const ms = 600 * Math.pow(2, attempt-1)
          await new Promise(r=>setTimeout(r, ms))
          continue
        }
        break
      }
    }

    return NextResponse.json({ ok:false, error:lastError||'Request failed' }, { status:502 })
  }catch(e){
    return NextResponse.json({ ok:false, error:e?.message||'Server error' }, { status:500 })
  }
}
