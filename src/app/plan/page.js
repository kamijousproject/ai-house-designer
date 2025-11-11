'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PlanPage() {
  const planModuleRef = useRef(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let mounted = true
    import(/* webpackIgnore: true */ '/ai-house-designer/assets/js/modules/planSvg.js')
      .then((mod) => {
        if (!mounted) return
        planModuleRef.current = mod
        handleGenPlan()
      })
      .catch(() => {
        setError('โหลดโมดูลวาดแปลนไม่สำเร็จ')
      })
    return () => { mounted = false }
  }, [])

  const getCfg = () => {
    const plotW = Number(document.getElementById('plotW')?.value || 12)
    const plotL = Number(document.getElementById('plotL')?.value || 20)
    const floors = parseInt(document.getElementById('floors')?.value || '2', 10)
    const floorH = Number(document.getElementById('floorH')?.value || 3)
    const roofType = 'gable'
    return { plotW, plotL, floors, floorH, roofType }
  }

  const handleGenPlan = () => {
    const svg = document.getElementById('planSVG')
    if (!svg || !planModuleRef.current?.drawPlan) return
    const cfg = getCfg()
    planModuleRef.current.drawPlan(svg, cfg)
  }

  const handleDownloadPng = () => {
    const svg = document.getElementById('planSVG')
    if (!svg || !planModuleRef.current?.downloadPlanPNG) return
    planModuleRef.current.downloadPlanPNG(svg)
  }

  const handleDownloadSvg = () => {
    const svg = document.getElementById('planSVG')
    if (!svg) return
    const data = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([data], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'plan_forward_studio.svg'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('กรุณากรอกคำสั่ง AI')
      return
    }
    setLoading(true)
    setError('')
    try {
      const base = getCfg()
      const composed = `${aiPrompt}\nข้อกำหนด: floors=${base.floors}, floorH=${base.floorH}, roofType=${base.roofType}`
      const res = await fetch('/ai-house-designer/api/ai-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: composed })
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'AI ไม่สามารถสร้างแปลนได้')
      const d = json.data
      // Apply AI results into inputs
      const $plotW = document.getElementById('plotW')
      const $plotL = document.getElementById('plotL')
      const $floors = document.getElementById('floors')
      const $floorH = document.getElementById('floorH')
      if ($plotW) $plotW.value = d.plotW
      if ($plotL) $plotL.value = d.plotL
      if ($floors) $floors.value = String(d.floors)
      if ($floorH) $floorH.value = d.floorH
      // Draw plan with AI config
      handleGenPlan()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3"><i className="fa-solid fa-ruler-combined me-2"></i>ตั้งค่าแปลน</h5>

                {/* AI prompt */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                    สร้างแปลนด้วย AI
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="เช่น บ้าน 2 ชั้น ครอบครัว 4 คน ครัวไทยแยก พื้นที่ใช้งาน ~160 ตร.ม."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2 w-100"
                    onClick={handleAIGenerate}
                    disabled={loading || !aiPrompt.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        กำลังสร้างด้วย AI...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                        สร้างจาก AI
                      </>
                    )}
                  </button>
                  {error && <div className="alert alert-danger mt-2 mb-0 small">{error}</div>}
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">กว้าง (ม.)</label>
                    <input id="plotW" type="number" className="form-control" defaultValue="12" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">ยาว (ม.)</label>
                    <input id="plotL" type="number" className="form-control" defaultValue="20" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">ชั้น</label>
                    <select id="floors" className="form-select" defaultValue="2">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">สูง/ชั้น (ม.)</label>
                    <input id="floorH" type="number" className="form-control" defaultValue="3" step="0.1" />
                  </div>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button id="genPlan" className="btn btn-primary" onClick={handleGenPlan}>
                    <i className="fa-solid fa-drafting-compass me-2"></i>สร้างแปลน
                  </button>
                  <button id="dlPlanPng" className="btn btn-success" onClick={handleDownloadPng}>
                    <i className="fa-solid fa-image me-2"></i>Export PNG
                  </button>
                  <button id="dlPlanSvg" className="btn btn-info" onClick={handleDownloadSvg}>
                    <i className="fa-solid fa-vector-square me-2"></i>Export SVG
                  </button>
                  <button className="btn btn-secondary" onClick={() => window.print()}>
                    <i className="fa-solid fa-print me-2"></i>พิมพ์แปลน
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-building me-2"></i>แบบแปลนบ้าน (สเกล 1:100)
                </h5>
                <div id="planWrap" style={{background: '#fff', border: '1px dashed #e5e7eb', borderRadius: '12px', padding: '8px'}}>
                  <svg id="planSVG" width="794" height="340" role="img" aria-label="SVG House Plan"></svg>
                </div>
                <div className="mt-3 small text-muted">
                  <i className="fa-solid fa-info-circle me-2"></i>
                  แปลนนี้เป็นการประมาณการเบื้องต้น ควรให้สถาปนิกหรือวิศวกรตรวจสอบก่อนก่อสร้างจริง
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
