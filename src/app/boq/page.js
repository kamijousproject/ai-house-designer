'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function BOQPage() {
  const boqModuleRef = useRef(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([
      import(/* webpackIgnore: true */ '/ai-house-designer/assets/js/modules/boqTable.js'),
      import(/* webpackIgnore: true */ '/ai-house-designer/assets/js/modules/styles.js')
    ])
      .then(([boqMod, stylesMod]) => {
        if (!mounted) return
        boqModuleRef.current = boqMod
        const sel = document.getElementById('styleSel')
        if (sel && stylesMod?.STYLES?.length) {
          sel.innerHTML = ''
          stylesMod.STYLES.forEach(s => {
            const opt = document.createElement('option')
            opt.value = s.id
            opt.textContent = s.name
            sel.appendChild(opt)
          })
          if (!sel.value) sel.value = 'modern'
        }
      })
      .catch(() => setError('โหลดโมดูล BOQ ไม่สำเร็จ'))
    return () => { mounted = false }
  }, [])

  const getCfg = () => {
    const plotW = Number(document.getElementById('plotW')?.value || 12)
    const plotL = Number(document.getElementById('plotL')?.value || 20)
    const floors = parseInt(document.getElementById('floors')?.value || '2', 10)
    const floorH = Number(document.getElementById('floorH')?.value || 3)
    const roofType = document.getElementById('roofType')?.value || 'gable'
    const styleSel = document.getElementById('styleSel')?.value || 'modern'
    const floodRisk = !!document.getElementById('floodRisk')?.checked
    const softSoil = !!document.getElementById('softSoil')?.checked
    return { plotW, plotL, floors, floorH, roofType, styleSel, floodRisk, softSoil }
  }

  const handleCalcLocal = () => {
    const mod = boqModuleRef.current
    if (!mod?.buildBOQ) return
    const tbody = document.querySelector('#boqTable tbody')
    const footerEls = {
      sumMat: document.getElementById('sumMat'),
      sumOH: document.getElementById('sumOH'),
      sumAll: document.getElementById('sumAll'),
    }
    mod.buildBOQ(tbody, footerEls, getCfg())
  }

  const handleAIBOQ = async () => {
    if (!aiPrompt.trim()) { setError('กรุณากรอกคำสั่ง AI'); return }
    setLoading(true)
    setError('')
    try {
      const cfg = getCfg()
      const res = await fetch('/ai-house-designer/api/ai-boq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, cfg })
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'AI ไม่สามารถคำนวณ BOQ ได้')
      const mod = boqModuleRef.current
      const tbody = document.querySelector('#boqTable tbody')
      const footerEls = {
        sumMat: document.getElementById('sumMat'),
        sumOH: document.getElementById('sumOH'),
        sumAll: document.getElementById('sumAll'),
      }
      if (mod?.buildBOQFromRows) {
        mod.buildBOQFromRows(tbody, footerEls, json.data.items)
      } else {
        handleCalcLocal()
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCsv = () => {
    const mod = boqModuleRef.current
    const table = document.getElementById('boqTable')
    if (mod?.downloadCSV && table) mod.downloadCSV(table)
  }

  const handleExportPdf = async () => {
    try {
      const pdfMod = await import(/* webpackIgnore: true */ '/ai-house-designer/assets/js/modules/exportPdf.js')
      await pdfMod.exportPDF()
    } catch {
      alert('ไม่สามารถสร้าง PDF ได้')
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="container py-4">
        <div className="row g-3">
          {/* Left: Settings */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-2"><i className="fa-solid fa-table-list me-2"></i>ตั้งค่า BOQ</h5>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                    คำนวณ BOQ ด้วย AI
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="เช่น บ้าน 2 ชั้น 3 ห้องนอน ครัวไทยแยก พื้นที่ใช้งาน ~180 ตร.ม. งบประมาณปานกลาง"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2 w-100"
                    onClick={handleAIBOQ}
                    disabled={loading || !aiPrompt.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        กำลังคำนวณด้วย AI...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                        คำนวณด้วย AI
                      </>
                    )}
                  </button>
                  {error && <div className="alert alert-danger mt-2 mb-0 small">{error}</div>}
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">กว้างที่ดิน (ม.)</label>
                    <input id="plotW" type="number" className="form-control" defaultValue="12" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">ยาวที่ดิน (ม.)</label>
                    <input id="plotL" type="number" className="form-control" defaultValue="20" step="0.1" />
                  </div>

                  <div className="col-6">
                    <label className="form-label">จำนวนชั้น</label>
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

                  <div className="col-6">
                    <label className="form-label">หลังคา</label>
                    <select id="roofType" className="form-select">
                      <option value="gable">จั่ว</option>
                      <option value="hip">ปั้นหยา</option>
                      <option value="shed">เพิงหมาแหงน</option>
                      <option value="flat">ดาดฟ้า</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">สไตล์บ้าน</label>
                    <select id="styleSel" className="form-select"></select>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input id="floodRisk" className="form-check-input" type="checkbox" />
                      <label className="form-check-label" htmlFor="floodRisk">พื้นที่เสี่ยงน้ำท่วม</label>
                    </div>
                    <div className="form-check">
                      <input id="softSoil" className="form-check-input" type="checkbox" />
                      <label className="form-check-label" htmlFor="softSoil">ดินอ่อน</label>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button id="calcBtn" className="btn btn-primary" onClick={handleCalcLocal}>
                    <i className="fa-solid fa-calculator me-2"></i>คำนวณ BOQ
                  </button>
                  <button id="dlBoqCsv" className="btn btn-success" onClick={handleExportCsv}>
                    <i className="fa-solid fa-file-csv me-2"></i>Export CSV
                  </button>
                  <button id="dlBoqPdf" className="btn btn-danger" onClick={handleExportPdf}>
                    <i className="fa-solid fa-file-pdf me-2"></i>Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: BOQ Table */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-file-invoice-dollar me-2"></i>
                  ตารางค่าใช้จ่าย (Bill of Quantities)
                </h5>

                <div className="table-responsive">
                  <table className="table table-sm align-middle" id="boqTable">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>งาน</th>
                        <th className="text-end">ปริมาณ</th>
                        <th>หน่วย</th>
                        <th className="text-end">ราคา/หน่วย</th>
                        <th className="text-end">รวม</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot>
                      <tr className="table-light">
                        <th colSpan="5" className="text-end">รวมค่าวัสดุ</th>
                        <th className="text-end" id="sumMat">0</th>
                      </tr>
                      <tr className="table-light">
                        <th colSpan="5" className="text-end">+ OH (30%)</th>
                        <th className="text-end" id="sumOH">0</th>
                      </tr>
                      <tr className="table-primary">
                        <th colSpan="5" className="text-end">รวมทั้งหมด</th>
                        <th className="text-end" id="sumAll">0</th>
                      </tr>
                    </tfoot>
                  </table>
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
