'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function BOQPage() {
  useEffect(() => {
    // Load BOQ calculation script
    const script = document.createElement('script')
    script.src = '/ai-house-designer/assets/js/modules/boqTable.js'
    script.type = 'module'
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

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
                  <button id="calcBtn" className="btn btn-primary">
                    <i className="fa-solid fa-calculator me-2"></i>คำนวณ BOQ
                  </button>
                  <button id="dlBoqCsv" className="btn btn-success">
                    <i className="fa-solid fa-file-csv me-2"></i>Export CSV
                  </button>
                  <button id="dlBoqPdf" className="btn btn-danger">
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
