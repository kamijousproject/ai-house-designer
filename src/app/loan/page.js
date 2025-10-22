'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LoanPage() {
  const [loanAmount, setLoanAmount] = useState(2000000)
  const [interestRate, setInterestRate] = useState(5.5)
  const [loanYears, setLoanYears] = useState(20)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12
    const months = parseFloat(loanYears) * 12

    if (rate === 0) {
      const monthly = principal / months
      setMonthlyPayment(monthly)
      setTotalPayment(principal)
      setTotalInterest(0)
    } else {
      const monthly = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      const total = monthly * months
      const interest = total - principal

      setMonthlyPayment(monthly)
      setTotalPayment(total)
      setTotalInterest(interest)
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-calculator me-2"></i>
                  คำนวณสินเชื่อบ้าน
                </h5>

                <div className="mb-3">
                  <label className="form-label">
                    วงเงินกู้ (บาท): {loanAmount.toLocaleString('th-TH')}
                  </label>
                  <input 
                    type="range" 
                    className="form-range" 
                    min="100000" 
                    max="10000000" 
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="form-control mt-2" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    อัตราดอกเบี้ย (%/ปี): {interestRate}
                  </label>
                  <input 
                    type="range" 
                    className="form-range" 
                    min="1" 
                    max="15" 
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="form-control mt-2" 
                    value={interestRate}
                    step="0.1"
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    ระยะเวลา (ปี): {loanYears}
                  </label>
                  <input 
                    type="range" 
                    className="form-range" 
                    min="5" 
                    max="30" 
                    step="1"
                    value={loanYears}
                    onChange={(e) => setLoanYears(e.target.value)}
                  />
                  <input 
                    type="number" 
                    className="form-control mt-2" 
                    value={loanYears}
                    onChange={(e) => setLoanYears(e.target.value)}
                  />
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary" onClick={calculateLoan}>
                    <i className="fa-solid fa-calculator me-2"></i>
                    คำนวณ
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fa-solid fa-chart-line me-2"></i>
                  ผลการคำนวณ
                </h5>

                <div className="row g-3">
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted mb-1">ผ่อนต่อเดือน</div>
                      <h3 className="text-primary mb-0">
                        {monthlyPayment.toLocaleString('th-TH', {maximumFractionDigits: 0})} บาท
                      </h3>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted mb-1">เงินต้น</div>
                      <h5 className="mb-0">
                        {parseFloat(loanAmount).toLocaleString('th-TH', {maximumFractionDigits: 0})} บาท
                      </h5>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted mb-1">ดอกเบี้ยรวม</div>
                      <h5 className="mb-0 text-danger">
                        {totalInterest.toLocaleString('th-TH', {maximumFractionDigits: 0})} บาท
                      </h5>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <div className="small text-muted mb-1">ชำระรวมทั้งหมด</div>
                      <h4 className="mb-0">
                        {totalPayment.toLocaleString('th-TH', {maximumFractionDigits: 0})} บาท
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning mt-3">
                  <i className="fa-solid fa-exclamation-triangle me-2"></i>
                  <small>ผลการคำนวณเป็นเพียงการประมาณการเบื้องต้น อัตราดอกเบี้ยและเงื่อนไขจริงขึ้นอยู่กับธนาคาร</small>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body">
                <h6 className="mb-3">ธนาคารที่ให้บริการสินเชื่อบ้าน</h6>
                <div className="list-group">
                  <a href="https://www.scb.co.th/th/personal-banking/loans/home-loan.html" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-building-columns me-2"></i>ธนาคารไทยพาณิชย์
                  </a>
                  <a href="https://www.kasikornbank.com/th/personal/loan/Pages/HomeLoan.aspx" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-building-columns me-2"></i>ธนาคารกสิกรไทย
                  </a>
                  <a href="https://www.bangkokbank.com/th-TH/Personal/Loan/Home-Loan" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-building-columns me-2"></i>ธนาคารกรุงเทพ
                  </a>
                  <a href="https://www.krungsri.com/th/personal/loan/home-loan" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action">
                    <i className="fa-solid fa-building-columns me-2"></i>ธนาคารกรุงศรีอยุธยา
                  </a>
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
