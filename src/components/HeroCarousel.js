'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HeroCarousel() {
  const router = useRouter()
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState('')

  useEffect(() => {
    // Pause carousel if prefers-reduced-motion
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const carousel = document.getElementById('heroCarousel')
        if (carousel) carousel.removeAttribute('data-bs-ride')
      }
    } catch(e) {}
  }, [])

  const handleOpenLightbox = () => {
    const activeImg = document.querySelector('#heroCarousel .carousel-item.active img')
    if (activeImg) {
      setLightboxSrc(activeImg.currentSrc || activeImg.src)
      setShowLightbox(true)
    }
  }

  const handleChooseStyle = () => {
    try {
      localStorage.setItem('fs_style', 'modern')
    } catch(e) {}
    router.push('/designer')
  }

  return (
    <>
      <div className="hero-gallery card shadow-sm">
        <div 
          id="heroCarousel" 
          className="carousel slide carousel-fade"
          data-bs-ride="carousel" 
          data-bs-interval="3500" 
          data-bs-pause="hover" 
          aria-label="แกลเลอรีสไตล์บ้าน"
        >
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-label="ภาพ 1" aria-current="true"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="ภาพ 2"></button>
          </div>

          <div className="carousel-inner ratio ratio-16x9">
            <div className="carousel-item active">
              <img 
                className="w-100 h-100 object-cover js-lightbox"
                src="/ai-house-designer/assets/images/hero/modern-1600.webp"
                alt="บ้านสไตล์โมเดิร์น — มุมมอง 1"
                data-style="modern"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="carousel-item">
              <img 
                className="w-100 h-100 object-cover js-lightbox"
                src="/ai-house-designer/assets/images/hero/modern-1200.webp"
                alt="บ้านสไตล์โมเดิร์น — มุมมอง 2"
                data-style="modern"
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" aria-label="ภาพก่อนหน้า">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" aria-label="ภาพถัดไป">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>

          <div className="overlay-choose">
            <span className="small-muted ms-1">สไตล์: โมเดิร์น</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light choose-style-btn" onClick={handleChooseStyle}>
                <i className="fa-solid fa-check me-1" aria-hidden="true"></i>เลือกสไตล์นี้
              </button>
              <button className="btn btn-sm btn-outline-light" onClick={handleOpenLightbox}>
                <i className="fa-regular fa-image me-1" aria-hidden="true"></i>ดูภาพใหญ่
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowLightbox(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-dark">
              <button 
                className="btn btn-light position-absolute end-0 m-2" 
                onClick={() => setShowLightbox(false)}
                aria-label="ปิด"
              >
                ปิด
              </button>
              <img src={lightboxSrc} className="img-fluid rounded-3" alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
