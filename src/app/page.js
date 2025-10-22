'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroCarousel from '@/components/HeroCarousel'

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-wrap">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="container hero-content">
          <div className="row align-items-center g-4">
            {/* Left text */}
            <div className="col-lg-7">
              <span className="pill mb-3 d-inline-flex align-items-center gap-2">
                <i className="fa-solid fa-sparkles" aria-hidden="true"></i> AI House Designer รุ่นทดลอง
              </span>

              <h1 className="hero-title h2 h1-lg">
                เริ่มไอเดียบ้านใน <span className="grad-text">ไม่กี่คลิก</span>
              </h1>
              <p className="hero-sub lead">
                กำหนดที่ดิน เลือกสไตล์ พรีวิว 3D สร้างแบบแปลนและ BOQ อัตโนมัติ พร้อมแผนที่วิเคราะห์แดด/ลม
              </p>

              <div className="d-flex flex-wrap gap-2 mt-3">
                <a className="btn btn-cta" href="/ai-house-designer/designer">
                  <i className="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>เริ่มออกแบบ
                </a>
                <a className="btn btn-ghost" href="/ai-house-designer/boq">
                  <i className="fa-solid fa-file-invoice-dollar me-2" aria-hidden="true"></i>ดู BOQ ตัวอย่าง
                </a>
                <a className="btn btn-ghost" href="/ai-house-designer/permit">
                  <i className="fa-solid fa-file-signature me-2" aria-hidden="true"></i>ขออนุญาตก่อสร้าง
                </a>
                <a className="btn btn-ghost" href="/ai-house-designer/loan">
                  <i className="fa-solid fa-landmark me-2" aria-hidden="true"></i>ขอสินเชื่อ/คำนวณผ่อน
                </a>
              </div>

              <div className="trust mt-4 small-muted">
                <i className="fa-regular fa-circle-check me-2" aria-hidden="true"></i>
                พัฒนาโดย Forward Studio — ใช้งานฟรีขั้นต้น เติมเครดิตเมื่อ Export ขั้นสูง
              </div>
            </div>

            {/* Right hero gallery */}
            <div className="col-lg-5">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/designer" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-cube" aria-hidden="true"></i></div>
              <h5 className="mb-1">พรีวิว 3D + ตั้งค่าบ้าน</h5>
              <p className="mb-0 small-muted">กำหนดขนาดที่ดิน/สไตล์/ชั้น/สี และดูโมเดล 3D ทันที</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/plan" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-ruler-combined" aria-hidden="true"></i></div>
              <h5 className="mb-1">แบบแปลนมาตรฐาน</h5>
              <p className="mb-0 small-muted">สร้างแปลน SVG สเกล 1:100 พิมพ์/ดาวน์โหลด PNG ได้</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/boq" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-table-list" aria-hidden="true"></i></div>
              <h5 className="mb-1">คำนวณ BOQ</h5>
              <p className="mb-0 small-muted">สูตรมาตรฐาน ปรับราคา/หน่วยเองได้ และ Export PDF/CSV</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/map" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-sun" aria-hidden="true"></i></div>
              <h5 className="mb-1">แผนที่/แดดลม</h5>
              <p className="mb-0 small-muted">ระบุตำแหน่งที่ดิน วิเคราะห์ทิศแดดและลมมรสุมเบื้องต้น</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/contractors" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-user-helmet-safety" aria-hidden="true"></i></div>
              <h5 className="mb-1">ค้นหาผู้รับเหมา</h5>
              <p className="mb-0 small-muted">ลิงก์ค้นหาในพื้นที่ พร้อมเช็คลิสต์คัดเลือกผู้รับเหมา</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/feng" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-yin-yang" aria-hidden="true"></i></div>
              <h5 className="mb-1">วิเคราะห์ฮวงจุ้ย</h5>
              <p className="mb-0 small-muted">คำแนะนำโทนสี/การจัดวางตามทิศ (เพื่อความสบายใจ)</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/permit" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-file-signature" aria-hidden="true"></i></div>
              <h5 className="mb-1">ขออนุญาตก่อสร้าง</h5>
              <p className="mb-0 small-muted">ขั้นตอน/เอกสาร/แนวทางยื่นตาม พ.ร.บ.ควบคุมอาคาร</p>
            </a>
          </div>
          <div className="col-md-6 col-lg-4">
            <a href="/ai-house-designer/loan" className="feature-card">
              <div className="icon-wrap"><i className="fa-solid fa-landmark" aria-hidden="true"></i></div>
              <h5 className="mb-1">ขอสินเชื่อ/คำนวณผ่อน</h5>
              <p className="mb-0 small-muted">คำนวณดอกเบี้ย-งวดผ่อน และส่งคำขอไปยังธนาคาร</p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
