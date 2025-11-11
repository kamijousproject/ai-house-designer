'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContractorsPage() {
  return (
    <>
      <Navbar />
      
      <div className="container py-4">
        <div className="card">
          <div className="card-body">
            <h3 className="mb-4">
              <i className="fa-solid fa-hard-hat me-2"></i>
              ค้นหาและคัดเลือกผู้รับเหมา
            </h3>

            <div className="row g-4">
              <div className="col-lg-6">
                <h5>แหล่งค้นหาผู้รับเหมา</h5>
                <div className="list-group">
                  <a href="https://www.facebook.com/groups/search/groups/?q=ผู้รับเหมา" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-brands fa-facebook me-2"></i>
                    กลุ่ม Facebook ผู้รับเหมา
                  </a>
                  <a href="https://www.google.com/search?q=ผู้รับเหมาก่อสร้างใกล้ฉัน" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-brands fa-google me-2"></i>
                    ค้นหาใน Google Maps
                  </a>
                  <a href="https://www.baania.com/" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-house me-2"></i>
                    Baania.com
                  </a>
                  <a href="https://www.homepro.co.th/" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-store me-2"></i>
                    HomePro (บริการหาช่าง)
                  </a>
                </div>
              </div>

              <div className="col-lg-6">
                <h5>เช็คลิสต์การคัดเลือก</h5>
                <div className="list-group">
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check1" />
                    <label className="form-check-label" htmlFor="check1">
                      ตรวจสอบใบอนุญาตประกอบวิชาชีพ
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check2" />
                    <label className="form-check-label" htmlFor="check2">
                      ขอดูผลงานที่ผ่านมา
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check3" />
                    <label className="form-check-label" htmlFor="check3">
                      ตรวจสอบรีวิวจากลูกค้าเดิม
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check4" />
                    <label className="form-check-label" htmlFor="check4">
                      เปรียบเทียบราคาอย่างน้อย 3 ราย
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check5" />
                    <label className="form-check-label" htmlFor="check5">
                      ทำสัญญาเป็นลายลักษณ์อักษร
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check6" />
                    <label className="form-check-label" htmlFor="check6">
                      มีการประกันงานและรับประกันคุณภาพ
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check7" />
                    <label className="form-check-label" htmlFor="check7">
                      มีการแบ่งชำระเงินตามงวดงาน
                    </label>
                  </div>
                  <div className="list-group-item">
                    <input className="form-check-input me-2" type="checkbox" id="check8" />
                    <label className="form-check-label" htmlFor="check8">
                      ตรวจสอบประกันภัยแรงงาน
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="alert alert-warning">
                  <i className="fa-solid fa-triangle-exclamation me-2"></i>
                  <strong>คำเตือน:</strong> ควรระวังผู้รับเหมาที่ขอเงินมัดจำสูงเกินไป (มากกว่า 30%) 
                  หรือไม่ยอมทำสัญญาที่ชัดเจน
                </div>
              </div>

              <div className="col-12">
                <h5>คำถามที่ควรถาม</h5>
                <ul className="list-group">
                  <li className="list-group-item">มีประสบการณ์ก่อสร้างบ้านแบบนี้มากี่หลัง?</li>
                  <li className="list-group-item">ระยะเวลาก่อสร้างโดยประมาณกี่วัน?</li>
                  <li className="list-group-item">มีทีมช่างประจำหรือจ้างรายวัน?</li>
                  <li className="list-group-item">รับประกันงานกี่ปี? ครอบคลุมอะไรบ้าง?</li>
                  <li className="list-group-item">ราคาที่เสนอรวมอะไรบ้าง? มีค่าใช้จ่ายแอบแฝงไหม?</li>
                  <li className="list-group-item">กรณีมีปัญหาระหว่างก่อสร้าง จะแก้ไขอย่างไร?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
