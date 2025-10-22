'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  
  const isActive = (path) => pathname === path ? 'active' : ''
  
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark" role="navigation" aria-label="หลัก">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" href="/">
            <i className="fa-solid fa-house-chimney-window me-2" aria-hidden="true"></i>
            <span>Forward Studio</span>
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#topNav" 
            aria-controls="topNav" 
            aria-expanded="false" 
            aria-label="เปิดเมนู"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="topNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/')}`} href="/" aria-current={pathname === '/' ? 'page' : undefined}>
                  หน้าแรก
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/designer')}`} href="/designer">
                  Designer
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/plan')}`} href="/plan">
                  แบบแปลน
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/boq')}`} href="/boq">
                  BOQ
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/map')}`} href="/map">
                  แผนที่/แดดลม
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/permit')}`} href="/permit">
                  ขออนุญาต
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/loan')}`} href="/loan">
                  สินเชื่อ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
