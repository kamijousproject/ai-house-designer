import { areas } from './compute.js';
import { niceInt } from './ui.js';
export function buildBOQ(tbody, footerEls, cfg){
  const {plotW,plotL,floors,floorH,roofType,floodRisk,softSoil} = cfg;
  const { usable, constructed, wallArea, roofArea } = areas({plotW,plotL,floors,floorH,roofType});
  const rows = [
    {name:'คอนกรีตฐานราก/พื้น/คาน', qty:(constructed*0.1), unit:'ลบ.ม.', rate: 2500},
    {name:'เหล็กเสริมโครงสร้าง', qty:(constructed*25/1000), unit:'ตัน', rate: 35000},
    {name:'อิฐก่อผนัง', qty:wallArea*110/1000, unit:'พันก้อน', rate: 6500},
    {name:'ปูน/ทราย/หิน (ก่อฉาบ)', qty:wallArea*0.035, unit:'ตัน', rate: 2200},
    {name:'ฉาบผนัง 2 ด้าน', qty:wallArea, unit:'ตร.ม.', rate: 160},
    {name:'หลังคา (แผ่น+โครง)', qty:roofArea, unit:'ตร.ม.', rate: 900},
    {name:'กระเบื้องพื้น', qty:usable, unit:'ตร.ม.', rate: 450},
    {name:'ทาสีภายใน/ภายนอก', qty:(wallArea*1.4), unit:'ตร.ม.', rate: 120},
    {name:'ประตู/หน้าต่าง (รวมวงกบ/อุปกรณ์)', qty:Math.max(6, Math.round(usable/25)), unit:'ชุด', rate: 4500},
    {name:'ระบบไฟฟ้า/ประปา (เหมาจร.)', qty:usable, unit:'ตร.ม.', rate: 700},
  ];
  if(softSoil) rows[0].rate = Math.round(rows[0].rate*1.15);
  if(floodRisk) rows[5].rate = Math.round(rows[5].rate*1.10);
  tbody.innerHTML='';
  rows.forEach((r,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${i+1}</td>
      <td>${r.name}</td>
      <td class="text-end">${r.qty.toFixed(2)}</td>
      <td>${r.unit}</td>
      <td class="text-end"><input type="number" class="form-control form-control-sm text-end rate" value="${r.rate}" min="0" /></td>
      <td class="text-end total">0</td>`;
    tbody.appendChild(tr);
  });
  const recalc=()=>{
    let sum=0;
    [...tbody.querySelectorAll('tr')].forEach((tr,idx)=>{
      const qty=rows[idx].qty, rate=parseFloat(tr.querySelector('.rate').value||0), total=qty*rate;
      tr.querySelector('.total').textContent = niceInt(Math.round(total)); sum+=total;
    });
    const over=sum*0.30;
    footerEls.sumMat.textContent=niceInt(Math.round(sum));
    footerEls.sumOH.textContent=niceInt(Math.round(over));
    footerEls.sumAll.textContent=niceInt(Math.round(sum+over));
  };
  tbody.addEventListener('input',recalc); recalc();
  return { usable };
}
export function downloadCSV(table){
  const rows = [['ลำดับ','งาน','ปริมาณ','หน่วย','ราคาต่อหน่วย(บาท)','ราคารวม(บาท)']];
  table.querySelectorAll('tbody tr').forEach((tr,i)=>{
    const tds=tr.querySelectorAll('td');
    rows.push([i+1, tds[1].textContent.trim(), tds[2].textContent.trim(), tds[3].textContent.trim(),
      tr.querySelector('.rate').value, tds[5].textContent.replace(/,/g,'')]);
  });
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\\n');
  const blob=new Blob([csv],{type:'text/csv'}), a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='boq_forward_studio.csv'; a.click();
}