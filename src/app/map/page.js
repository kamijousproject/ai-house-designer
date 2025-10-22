'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MapPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/ai-house-designer/assets/js/modules/maps.js'
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
                <h5 className="mb-3"><i className="fa-solid fa-map-location-dot me-2"></i>ตั้งค่าแผนที่</h5>

                <div className="mb-3">
                  <label className="form-label">ค้นหาที่ตั้ง</label>
                  <input id="searchBox" type="text" className="form-control" placeholder="ชื่อสถานที่หรือที่อยู่" />
                </div>

                <div className="mb-3">
                  <label className="form-label">พิกัด</label>
                  <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text">ละติจูด</span>
                    <input id="lat" type="number" className="form-control" defaultValue="13.7563" step="0.0001" />
                  </div>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">ลองจิจูด</span>
                    <input id="lng" type="number" className="form-control" defaultValue="100.5018" step="0.0001" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">ทิศหน้าบ้าน</label>
                  <select id="facing" className="form-select">
                    <option value="N">เหนือ (N)</option>
                    <option value="NE">ตะวันออกเฉียงเหนือ (NE)</option>
                    <option value="E">ตะวันออก (E)</option>
                    <option value="SE">ตะวันออกเฉียงใต้ (SE)</option>
                    <option value="S">ใต้ (S)</option>
                    <option value="SW">ตะวันตกเฉียงใต้ (SW)</option>
                    <option value="W">ตะวันตก (W)</option>
                    <option value="NW">ตะวันตกเฉียงเหนือ (NW)</option>
                  </select>
                </div>

                <div className="d-grid">
                  <button id="analyzeBtn" className="btn btn-primary">
                    <i className="fa-solid fa-magnifying-glass-chart me-2"></i>วิเคราะห์แดด/ลม
                  </button>
                </div>

                <div id="analysis" className="mt-3"></div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-earth-asia me-2"></i>แผนที่ที่ตั้งโครงการ
                </h5>
                <div id="map" style={{width: '100%', height: '500px', background: '#e5e7eb', borderRadius: '8px'}}></div>
                <div className="mt-3 small text-muted">
                  <i className="fa-solid fa-info-circle me-2"></i>
                  คลิกบนแผนที่เพื่อเลือกตำแหน่งที่ดิน
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
