'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './designer.css'

export default function DesignerPage() {
  // State for form data
  const [aiPrompt, setAiPrompt] = useState('')
  const [plotW, setPlotW] = useState('')
  const [plotL, setPlotL] = useState('')
  const [floors, setFloors] = useState('')
  const [floorH, setFloorH] = useState('')
  const [roofType, setRoofType] = useState('')
  const [colorMain, setColorMain] = useState('#e0e7ff')
  const [floodRisk, setFloodRisk] = useState(false)
  const [softSoil, setSoftSoil] = useState(false)
  const [styleSel, setStyleSel] = useState('')
  
  // State for validation and results
  const [aiGenerated, setAiGenerated] = useState(false)
  const [manualFilled, setManualFilled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [boqData, setBoqData] = useState([])

  // Check if manual form is filled
  useEffect(() => {
    const filled = plotW && plotL && floors && floorH && roofType && styleSel
    setManualFilled(!!filled)
  }, [plotW, plotL, floors, floorH, roofType, styleSel])

  // Check if both conditions are met
  useEffect(() => {
    setShowResults(aiGenerated && manualFilled)
  }, [aiGenerated, manualFilled])

  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('กรุณากรอก AI Prompt')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/ai-house-designer/api/ai-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      })

      const result = await response.json()

      if (result.ok && result.data) {
        // Fill form with AI data
        setPlotW(result.data.plotW)
        setPlotL(result.data.plotL)
        setFloors(result.data.floors)
        setFloorH(result.data.floorH)
        setRoofType(result.data.roofType)
        setColorMain(result.data.color)
        setFloodRisk(result.data.floodRisk)
        setSoftSoil(result.data.softSoil)
        setStyleSel(result.data.style)
        setAiGenerated(true)
        
        alert('✅ AI สร้างข้อมูลสำเร็จ! ตรวจสอบและปรับแต่งได้ตามต้องการ')
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดจาก AI')
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อ AI ได้: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate BOQ when data is ready
  useEffect(() => {
    if (showResults) {
      calculateBOQ()
      loadScripts()
    }
  }, [showResults])

  // Calculate BOQ
  const calculateBOQ = () => {
    const area = parseFloat(plotW) * parseFloat(plotL)
    const usableArea = area * 0.6 * parseInt(floors)
    
    const items = [
      { no: 1, name: 'งานเสาเข็ม', qty: floodRisk || softSoil ? area * 0.5 : 0, unit: 'ตร.ม.', price: 2500, total: 0 },
      { no: 2, name: 'งานฐานราก', qty: area, unit: 'ตร.ม.', price: 3500, total: 0 },
      { no: 3, name: 'งานโครงสร้าง', qty: usableArea, unit: 'ตร.ม.', price: 8000, total: 0 },
      { no: 4, name: 'งานผนัง', qty: usableArea * 1.5, unit: 'ตร.ม.', price: 1200, total: 0 },
      { no: 5, name: 'งานหลังคา', qty: area * 1.2, unit: 'ตร.ม.', price: roofType === 'flat' ? 2500 : 1800, total: 0 },
      { no: 6, name: 'งานปูพื้น', qty: usableArea, unit: 'ตร.ม.', price: 800, total: 0 },
      { no: 7, name: 'งานทาสี', qty: usableArea * 2, unit: 'ตร.ม.', price: 150, total: 0 },
      { no: 8, name: 'งานประตูหน้าต่าง', qty: parseInt(floors) * 8, unit: 'บาน', price: 5000, total: 0 },
      { no: 9, name: 'งานไฟฟ้า', qty: usableArea, unit: 'ตร.ม.', price: 800, total: 0 },
      { no: 10, name: 'งานประปา', qty: usableArea, unit: 'ตร.ม.', price: 600, total: 0 },
    ]

    const calculated = items.map(item => ({
      ...item,
      total: item.qty * item.price
    }))

    setBoqData(calculated)
  }

  // Load Three.js and modules
  const loadScripts = () => {
    const scripts = [
      { src: '/ai-house-designer/assets/vendor/three/three.module.js', type: 'module' },
      { src: '/ai-house-designer/assets/js/modules/state.js', type: 'module' },
      { src: '/ai-house-designer/assets/js/modules/styles.js', type: 'module' },
      { src: '/ai-house-designer/assets/js/modules/compute.js', type: 'module' },
      { src: '/ai-house-designer/assets/js/modules/threeScene.js', type: 'module' },
      { src: '/ai-house-designer/assets/js/modules/planSvg.js', type: 'module' },
    ]

    scripts.forEach(scriptConfig => {
      const script = document.createElement('script')
      script.src = scriptConfig.src
      if (scriptConfig.type) script.type = scriptConfig.type
      document.body.appendChild(script)
    })
  }

  const sumMat = boqData.reduce((sum, item) => sum + item.total, 0)
  const sumOH = sumMat * 0.3
  const sumAll = sumMat + sumOH

  return (
    <>
      <Navbar />
      
      <div className="container-fluid p-3">
        <div className="row g-3">
          {/* Left: Controls */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-sliders me-2"></i>
                  ตั้งค่าโครงการ
                </h5>

                {/* Status indicators */}
                <div className="alert alert-info mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span>1. AI Prompt</span>
                    {aiGenerated ? (
                      <i className="fa-solid fa-check-circle text-success"></i>
                    ) : (
                      <i className="fa-solid fa-circle text-muted"></i>
                    )}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>2. ข้อมูลพื้นฐาน</span>
                    {manualFilled ? (
                      <i className="fa-solid fa-check-circle text-success"></i>
                    ) : (
                      <i className="fa-solid fa-circle text-muted"></i>
                    )}
                  </div>
                  <hr />
                  <small className="text-muted">
                    {showResults ? '✅ พร้อมแสดงผล' : '⏳ กรุณากรอกข้อมูลให้ครบทั้ง 2 ส่วน'}
                  </small>
                </div>

                {/* AI prompt */}
                <div className="mb-3">
                  <label htmlFor="aiPrompt" className="form-label">
                    <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                    สั่งงานด้วย AI (ขั้นตอนที่ 1)
                  </label>
                  <textarea 
                    id="aiPrompt" 
                    className="form-control" 
                    rows="3" 
                    placeholder="เช่น บ้านโมเดิร์น 2 ชั้น หลังคาแบน สีขาวเทา พื้นที่ ~180 ตร.ม. ดินอ่อน"
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
                        กำลังสร้าง...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                        สร้างจาก AI
                      </>
                    )}
                  </button>
                  {error && (
                    <div className="alert alert-danger mt-2 mb-0 small">{error}</div>
                  )}
                </div>

                <hr />

                {/* Manual inputs */}
                <h6 className="mb-2">
                  <i className="fa-solid fa-edit me-1"></i>
                  กรอกข้อมูลพื้นฐาน (ขั้นตอนที่ 2)
                </h6>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">กว้าง (ม.) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={plotW}
                      onChange={(e) => setPlotW(e.target.value)}
                      min="4" 
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">ยาว (ม.) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={plotL}
                      onChange={(e) => setPlotL(e.target.value)}
                      min="6" 
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">ชั้น *</label>
                    <select 
                      className="form-select"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      required
                    >
                      <option value="">เลือก</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">สูง/ชั้น (ม.) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={floorH}
                      onChange={(e) => setFloorH(e.target.value)}
                      min="2.6" 
                      max="4" 
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">หลังคา *</label>
                    <select 
                      className="form-select"
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value)}
                      required
                    >
                      <option value="">เลือก</option>
                      <option value="gable">จั่ว</option>
                      <option value="hip">ปั้นหยา</option>
                      <option value="shed">เพิงหมาแหงน</option>
                      <option value="flat">ดาดฟ้า</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">สีหลัก</label>
                    <input 
                      type="color" 
                      className="form-control form-control-color" 
                      value={colorMain}
                      onChange={(e) => setColorMain(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">สไตล์บ้าน *</label>
                    <select 
                      className="form-select"
                      value={styleSel}
                      onChange={(e) => setStyleSel(e.target.value)}
                      required
                    >
                      <option value="">เลือก</option>
                      <option value="modern">โมเดิร์น</option>
                      <option value="contemporary">คอนเทมโพรารี่</option>
                      <option value="classic">คลาสสิก</option>
                      <option value="loft">ลอฟท์</option>
                      <option value="nordic">นอร์ดิก</option>
                      <option value="minimal">มินิมอล</option>
                      <option value="tropical">ทรอปิคอล</option>
                    </select>
                  </div>
                  <div className="col-6 form-check ms-2">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="floodRisk"
                      checked={floodRisk}
                      onChange={(e) => setFloodRisk(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="floodRisk">
                      พื้นที่เสี่ยงน้ำท่วม
                    </label>
                  </div>
                  <div className="col-6 form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="softSoil"
                      checked={softSoil}
                      onChange={(e) => setSoftSoil(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="softSoil">
                      ดินอ่อน
                    </label>
                  </div>
                </div>

                {plotW && plotL && floors && (
                  <div className="mt-3 p-2 bg-light rounded">
                    <small className="text-muted">พื้นที่ใช้สอยประมาณ</small>
                    <h5 className="mb-0 text-primary">
                      {(parseFloat(plotW) * parseFloat(plotL) * 0.6 * parseInt(floors)).toFixed(0)} ตร.ม.
                    </h5>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="col-lg-8">
            {!showResults ? (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="fa-solid fa-info-circle fa-3x text-muted mb-3"></i>
                  <h5>กรุณากรอกข้อมูลให้ครบทั้ง 2 ส่วน</h5>
                  <p className="text-muted">
                    1. สร้างจาก AI Prompt<br />
                    2. กรอกข้อมูลพื้นฐาน (กว้าง, ยาว, ชั้น, สูง/ชั้น, หลังคา, สไตล์)
                  </p>
                  <div className="mt-3">
                    <div className="badge bg-secondary me-2">
                      AI: {aiGenerated ? '✅' : '❌'}
                    </div>
                    <div className="badge bg-secondary">
                      ข้อมูล: {manualFilled ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 3D Preview */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="mb-2">พรีวิว 3D</h6>
                    <div id="viewport" style={{ height: '400px', background: '#f8f9fa' }}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div className="text-center">
                          <i className="fa-solid fa-cube fa-2xl mb-2"></i>
                          <div>กำลังโหลด 3D Viewer...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOQ Table */}
                <div className="card">
                  <div className="card-body">
                    <h6 className="mb-3">
                      <i className="fa-solid fa-file-invoice-dollar me-2"></i>
                      ตารางค่าใช้จ่าย (BOQ)
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-sm align-middle">
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
                        <tbody>
                          {boqData.filter(item => item.qty > 0).map((item) => (
                            <tr key={item.no}>
                              <td>{item.no}</td>
                              <td>{item.name}</td>
                              <td className="text-end">{item.qty.toFixed(2)}</td>
                              <td>{item.unit}</td>
                              <td className="text-end">{item.price.toLocaleString()}</td>
                              <td className="text-end">{item.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="table-light">
                            <th colSpan="5" className="text-end">รวมค่าวัสดุ</th>
                            <th className="text-end">{sumMat.toLocaleString()}</th>
                          </tr>
                          <tr className="table-light">
                            <th colSpan="5" className="text-end">+ OH (30%)</th>
                            <th className="text-end">{sumOH.toLocaleString()}</th>
                          </tr>
                          <tr className="table-primary">
                            <th colSpan="5" className="text-end">รวมทั้งหมด</th>
                            <th className="text-end">{sumAll.toLocaleString()}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
