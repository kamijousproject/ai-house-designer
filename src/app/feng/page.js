'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FengPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/ai-house-designer/assets/js/modules/feng.js'
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
                <h5 className="mb-3">
                  <i className="fa-solid fa-yin-yang me-2"></i>
                  ตั้งค่าการวิเคราะห์
                </h5>

                <div className="mb-3">
                  <label className="form-label">ปีเกิด (พ.ศ.)</label>
                  <input id="birthYear" type="number" className="form-control" defaultValue="2533" min="2400" max="2600" />
                </div>

                <div className="mb-3">
                  <label className="form-label">ทิศหน้าบ้าน</label>
                  <select id="facing" className="form-select">
                    <option value="N">เหนือ</option>
                    <option value="NE">ตะวันออกเฉียงเหนือ</option>
                    <option value="E">ตะวันออก</option>
                    <option value="SE">ตะวันออกเฉียงใต้</option>
                    <option value="S">ใต้</option>
                    <option value="SW">ตะวันตกเฉียงใต้</option>
                    <option value="W">ตะวันตก</option>
                    <option value="NW">ตะวันตกเฉียงเหนือ</option>
                  </select>
                </div>

                <div className="d-grid">
                  <button id="analyzeBtn" className="btn btn-primary">
                    <i className="fa-solid fa-wand-magic-sparkles me-2"></i>
                    วิเคราะห์ฮวงจุ้ย
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-compass me-2"></i>
                  ผลการวิเคราะห์ฮวงจุ้ย
                </h5>

                <div id="fengResult">
                  <div className="text-center text-muted py-5">
                    <i className="fa-solid fa-yin-yang fa-3x mb-3 opacity-25"></i>
                    <p>กรุณากรอกข้อมูลและกดปุ่มวิเคราะห์</p>
                  </div>
                </div>

                <div className="alert alert-info mt-3">
                  <i className="fa-solid fa-info-circle me-2"></i>
                  <strong>หมายเหตุ:</strong> การวิเคราะห์นี้เป็นเพียงข้อมูลเพื่อความสบายใจและความเชื่อส่วนบุคคล 
                  ไม่ได้มีผลต่อการออกแบบทางสถาปัตยกรรมและวิศวกรรม
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
