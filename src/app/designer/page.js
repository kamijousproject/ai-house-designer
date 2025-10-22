'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './designer.css'

export default function DesignerPage() {
  useEffect(() => {
    // Load all required scripts for designer page
    const loadScripts = async () => {
      // Load Three.js and modules
      const scripts = [
        { src: '/ai-house-designer/assets/vendor/three/three.module.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/state.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/styles.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/compute.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/threeScene.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/planSvg.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/boqTable.js', type: 'module' },
        { src: '/ai-house-designer/assets/js/modules/ui.js', type: 'module' },
      ]

      for (const scriptConfig of scripts) {
        const script = document.createElement('script')
        script.src = scriptConfig.src
        if (scriptConfig.type) script.type = scriptConfig.type
        document.body.appendChild(script)
      }
    }

    loadScripts()
  }, [])

  return (
    <>
      <Navbar />
      
      <div className="container-fluid p-3">
        <div className="row g-3">
          {/* Left: Controls */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="mb-0"><i className="fa-solid fa-sliders me-2"></i>ตั้งค่าโครงการ</h5>
                  <div className="small-muted">กด <span className="badge-soft">R</span> เพื่อ Render ใหม่</div>
                </div>

                {/* AI prompt */}
                <div className="mb-3">
                  <label htmlFor="aiPrompt" className="form-label">สั่งงานด้วย AI</label>
                  <textarea id="aiPrompt" className="form-control" rows="2" placeholder="เช่น บ้านโมเดิร์น 2 ชั้น หลังคาแบน สีขาวเทา พื้นที่ ~180 ตร.ม. ดินอ่อน"></textarea>
                  <div className="d-flex gap-2 mt-2">
                    <button id="aiBtn" className="btn btn-primary btn-sm pill">
                      <i className="fa-solid fa-wand-magic-sparkles me-1"></i>สร้างจากคำสั่ง
                    </button>
                    <button id="loadLast" className="btn btn-outline-secondary btn-sm pill">
                      <i className="fa-solid fa-clock-rotate-left me-1"></i>โหลดการตั้งค่าล่าสุด
                    </button>
                  </div>
                  <div className="small-muted mt-1">ตัวอย่าง: "นอร์ดิก 2 ชั้น หลังคาจั่ว สีอ่อน พื้นที่ ~220 ตร.ม. พื้นที่เสี่ยงน้ำท่วม"</div>
                </div>

                {/* Best match helper */}
                <div className="mb-3 border rounded p-2">
                  <label className="form-label mb-1">
                    <i className="fa-solid fa-wand-magic-sparkles me-1"></i>หาแบบที่เหมาะที่สุด
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">พื้นที่เป้า</span>
                        <input id="goalArea" type="number" className="form-control" defaultValue="180" min="20" step="1" />
                        <span className="input-group-text">ตร.ม.</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">งบสูงสุด</span>
                        <input id="budgetMax" type="number" className="form-control" defaultValue="2500000" min="0" step="1000" />
                        <span className="input-group-text">บาท</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid mt-2">
                    <button id="bestBtn" className="btn btn-success btn-sm pill">หาแบบที่เหมาะที่สุด</button>
                  </div>
                  <div id="bestResult" className="small-muted mt-2" role="status" aria-live="polite"></div>
                </div>

                {/* Plot & structure inputs */}
                <div className="row g-2" id="inputGrid">
                  <div className="col-6">
                    <label className="form-label" htmlFor="plotW">กว้าง (ม.)</label>
                    <input id="plotW" type="number" className="form-control" defaultValue="12" min="4" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="plotL">ยาว (ม.)</label>
                    <input id="plotL" type="number" className="form-control" defaultValue="20" min="6" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="floors">ชั้น</label>
                    <select id="floors" className="form-select" defaultValue="2">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="floorH">สูง/ชั้น (ม.)</label>
                    <input id="floorH" type="number" className="form-control" defaultValue="3" min="2.6" max="4" step="0.1" />
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="roofType">หลังคา</label>
                    <select id="roofType" className="form-select">
                      <option value="gable">จั่ว</option>
                      <option value="hip">ปั้นหยา</option>
                      <option value="shed">เพิงหมาแหงน</option>
                      <option value="flat">ดาดฟ้า</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label" htmlFor="colorMain">สีหลัก</label>
                    <input id="colorMain" type="color" className="form-control form-control-color" defaultValue="#e0e7ff" />
                  </div>
                  <div className="col-6 form-check ms-2">
                    <input id="floodRisk" className="form-check-input" type="checkbox" />
                    <label className="form-check-label" htmlFor="floodRisk">พื้นที่เสี่ยงน้ำท่วม</label>
                  </div>
                  <div className="col-6 form-check">
                    <input id="softSoil" className="form-check-input" type="checkbox" />
                    <label className="form-check-label" htmlFor="softSoil">ดินอ่อน</label>
                  </div>
                </div>

                {/* Style selector */}
                <div className="mb-3">
                  <label className="form-label mt-2" htmlFor="styleSel">รูปแบบบ้าน</label>
                  <select id="styleSel" className="form-select mb-2"></select>
                  <div id="styleDesc" className="small-muted"></div>
                  <div id="styleGallery" className="row g-2 mt-2" role="list"></div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="small-muted">พื้นที่ใช้สอย ~ <span id="areaDisplay">0</span> ตร.ม.</div>
                  <div className="d-flex gap-2 no-print">
                    <button id="saveCfg" className="btn btn-outline-secondary btn-sm pill">
                      <i className="fa-solid fa-floppy-disk me-1"></i>บันทึก
                    </button>
                    <button id="resetCfg" className="btn btn-outline-danger btn-sm pill">
                      <i className="fa-solid fa-rotate-left me-1"></i>รีเซ็ต
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview & Outputs */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-2">พรีวิว 3D</h6>
                  <div className="no-print">
                    <button id="dlImage" className="btn btn-sm btn-outline-secondary">
                      <i className="fa-solid fa-camera me-1"></i>บันทึกภาพ
                    </button>
                  </div>
                </div>
                <div id="viewport" aria-label="3D Preview">
                  <div className="fallback">
                    <div className="mb-2"><i className="fa-solid fa-cube fa-2xl"></i></div>
                    <div>กำลังโหลดตัวเรนเดอร์… หากไม่แสดง ระบบจะลอง CDN อื่นและไฟล์สำรองอัตโนมัติ</div>
                  </div>
                </div>

                <hr />
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-2">แบบแปลน</h6>
                  <div className="no-print">
                    <button id="dlPlanPng" className="btn btn-sm btn-outline-primary">
                      <i className="fa-solid fa-image me-1"></i>Export PNG
                    </button>
                  </div>
                </div>
                <div id="planWrap">
                  <svg id="planSVG" width="794" height="340" role="img" aria-label="SVG House Plan"></svg>
                </div>

                <hr />
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="mb-2">BOQ</h6>
                  <div className="no-print">
                    <button id="dlBoqCsv" className="btn btn-sm btn-outline-success">
                      <i className="fa-solid fa-file-csv me-1"></i>Export CSV
                    </button>
                  </div>
                </div>
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
