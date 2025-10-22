'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PlanPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/ai-house-designer/assets/js/modules/planSvg.js'
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
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3"><i className="fa-solid fa-ruler-combined me-2"></i>ตั้งค่าแปลน</h5>

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
                  <button id="genPlan" className="btn btn-primary">
                    <i className="fa-solid fa-drafting-compass me-2"></i>สร้างแปลน
                  </button>
                  <button id="dlPlanPng" className="btn btn-success">
                    <i className="fa-solid fa-image me-2"></i>Export PNG
                  </button>
                  <button id="dlPlanSvg" className="btn btn-info">
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
