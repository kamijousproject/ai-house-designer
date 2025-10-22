import { $, } from './ui.js';
import { deductCredits } from './state.js';
export async function exportPDF(){
  if(!deductCredits(2, 'Export PDF')) return;
  const { jsPDF } = window.jspdf || {};
  if(!jsPDF || !window.jspdf || !window.jspdf.jsPDF){ alert('ไม่พบ jsPDF — ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const margin = 14;
  const proj = { addr:'-', area: '-', info:'Forward Studio' };
  // Cover
  doc.setFont('helvetica','bold'); doc.setFontSize(20);
  doc.text('AI House Designer — Forward Studio', margin, 20);
  doc.setFontSize(11); doc.setFont('helvetica','normal');
  doc.text(`ที่ตั้ง: ${proj.addr}`, margin, 28);
  doc.text(`ข้อมูลโครงการ (ย่อ): ${proj.info}`, margin, 34);
  // QR
  try{
    const qrDataURL = await window.QRCode.toDataURL('https://forwardstudio.co.th/contact', { width: 128, margin: 1 });
    doc.text('ติดต่อ Forward Studio', 160, 40);
    doc.addImage(qrDataURL, 'PNG', 160, 44, 30, 30);
  }catch{}
  doc.setFontSize(9); doc.text('หมายเหตุ: เอกสารเพื่อการวางแนวคิด ไม่ใช่แบบยื่นอนุญาต', margin, 80);
  // ToC
  doc.addPage();
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('สารบัญ', margin, 20);
  doc.setFont('helvetica','normal'); doc.setFontSize(12);
  ['1. ปก','2. สารบัญ','3. สรุป BOQ (ประมาณการ)'].forEach((t,i)=> doc.text(`${t}`, margin, 40 + i*10));
  // BOQ
  doc.addPage();
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('สรุป BOQ (ประมาณการ)', margin, 20);
  const body = [];
  document.querySelectorAll('#boqTable tbody tr').forEach((tr,i)=>{
    const tds = tr.querySelectorAll('td');
    const qty = tds[2].textContent.trim();
    const unit = tds[3].textContent.trim();
    const rate = tr.querySelector('.rate').value;
    const total = tds[5].textContent.trim();
    body.push([String(i+1), tds[1].textContent.trim(), qty, unit, rate, total]);
  });
  const sub = $('#sumMat')?.textContent || '0', oh = $('#sumOH')?.textContent || '0', all = $('#sumAll')?.textContent || '0';
  if(doc.autoTable){
    doc.autoTable({
      startY: 28,
      head: [['ลำดับ','งาน','ปริมาณ','หน่วย','ราคา/หน่วย (฿)','ราคารวม (฿)']],
      body,
      styles: { font:'helvetica', fontSize:10 },
      headStyles: { fillColor:[14,165,233], textColor:255 },
      columnStyles: { 0:{cellWidth:10}, 2:{halign:'right'}, 4:{halign:'right'}, 5:{halign:'right'} },
      theme: 'striped',
      margin: { left: margin, right: margin }
    });
    let y = doc.lastAutoTable.finalY + 6;
    doc.setFontSize(12);
    doc.text(`รวมค่าวัสดุ: ${sub} บาท`, margin, y); y+=6;
    doc.text(`+ ค่าดำเนินการ/กำไร/เผื่อ (30%): ${oh} บาท`, margin, y); y+=6;
    doc.text(`รวมประมาณการทั้งสิ้น: ${all} บาท`, margin, y);
  }else{
    doc.text('ไม่พบปลั๊กอิน autoTable — แสดงเฉพาะสรุปจำนวนเงิน:', margin, 28);
    doc.text(`รวมค่าวัสดุ: ${sub} บาท | OH: ${oh} บาท | รวม: ${all} บาท`, margin, 36);
  }
  doc.save('ForwardStudio_AI_House_Proposal.pdf');
  alert('บันทึก PDF แล้ว');
}