'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PermitPage() {
  return (
    <>
      <Navbar />
      
      <div className="container py-4">
        <div className="card">
          <div className="card-body">
            <h3 className="mb-4">
              <i className="fa-solid fa-file-signature me-2"></i>
              ขออนุญาตก่อสร้าง
            </h3>

            <div className="row g-4">
              <div className="col-lg-6">
                <h5>เอกสารที่ต้องเตรียม</h5>
                <ul className="list-group">
                  <li className="list-group-item">
                    <i className="fa-solid fa-check text-success me-2"></i>
                    สำเนาโฉนดที่ดิน/น.ส.3
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-check text-success me-2"></i>
                    แบบแปลนก่อสร้าง (ลงนามโดยสถาปนิก)
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-check text-success me-2"></i>
                    แบบโครงสร้าง (ลงนามโดยวิศวกร)
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-check text-success me-2"></i>
                    สำเนาบัตรประชาชนเจ้าของที่ดิน
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-check text-success me-2"></i>
                    หนังสือมอบอำนาจ (ถ้ามี)
                  </li>
                </ul>
              </div>

              <div className="col-lg-6">
                <h5>ขั้นตอนการยื่น</h5>
                <ol className="list-group list-group-numbered">
                  <li className="list-group-item">เตรียมเอกสารให้ครบถ้วน</li>
                  <li className="list-group-item">ยื่นคำขอที่เทศบาล/อบต.ในพื้นที่</li>
                  <li className="list-group-item">รอการตรวจสอบ (7-30 วัน)</li>
                  <li className="list-group-item">ชำระค่าธรรมเนียม</li>
                  <li className="list-group-item">รับใบอนุญาต</li>
                  <li className="list-group-item">เริ่มก่อสร้างได้</li>
                </ol>
              </div>

              <div className="col-12">
                <div className="alert alert-info">
                  <i className="fa-solid fa-lightbulb me-2"></i>
                  <strong>หมายเหตุ:</strong> บ้านที่มีพื้นที่ไม่เกิน 200 ตร.ม. และสูงไม่เกิน 2 ชั้น สามารถขอผ่อนผันไม่ต้องมีสถาปนิกและวิศวกรลงนามได้ในบางพื้นที่
                </div>
              </div>

              <div className="col-12">
                <h5>ค่าธรรมเนียมโดยประมาณ</h5>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th className="text-end">ค่าใช้จ่าย</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ค่าธรรมเนียมยื่นขออนุญาต</td>
                        <td className="text-end">1,000 - 5,000 บาท</td>
                      </tr>
                      <tr>
                        <td>ค่าสถาปนิกออกแบบ</td>
                        <td className="text-end">30,000 - 100,000 บาท</td>
                      </tr>
                      <tr>
                        <td>ค่าวิศวกรคำนวณโครงสร้าง</td>
                        <td className="text-end">20,000 - 80,000 บาท</td>
                      </tr>
                    </tbody>
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
