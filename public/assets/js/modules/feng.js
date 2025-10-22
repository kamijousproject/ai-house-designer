import { $, } from './ui.js';
export function fengShui(){
  const az = parseInt($('#azimuth')?.value||'0',10);
  const dir = ['N','NE','E','SE','S','SW','W','NW'][Math.round(((az%360)+360)%360/45)%8];
  const style = $('#style')?.value || 'modern';
  const color = $('#colorMain')?.value || '#e0e7ff';
  const floors = parseInt($('#floors')?.value||'1',10);
  const elementByDir = {N:'น้ำ', NE:'ดิน', E:'ไม้', SE:'ไม้', S:'ไฟ', SW:'ดิน', W:'โลหะ', NW:'โลหะ'};
  const luckyColors = {น้ำ:['น้ำเงิน','ฟ้า','ดำ'], ดิน:['ครีม','น้ำตาลอ่อน','เหลืองอ่อน'], ไม้:['เขียว','ฟ้าเทา'], ไฟ:['แดง','ส้ม','ชมพู'], โลหะ:['ขาว','เทา','เงิน']};
  const element = elementByDir[dir]; const colors = (luckyColors[element]||[]).join(' / ');
  const sugg = [];
  sugg.push(`บ้านหันหน้าไปทาง <strong>${dir}</strong> (ธาตุ <strong>${element}</strong>) แนะนำโทนสีมงคล: <strong>${colors}</strong>`);
  if(floors>=2) sugg.push('บ้านหลายชั้น: ให้หน้าบัน/โถงบันไดโล่ง โปร่ง รับลมแดดพอเหมาะ');
  if(style==='lanna') sugg.push('สไตล์ล้านนา: หลังคาสูง ระบายอากาศดี ใช้วัสดุไม้หรือสีเอิร์ธโทนเสริมฮวงจุ้ย');
  if(style==='modern') sugg.push('โมเดิร์น: หลีกเลี่ยงเหลี่ยมคมพุ่งเข้าประตู เพิ่มพืชพรรณลดพลังคม');
  sugg.push(`สีที่เลือกตอนนี้: <code>${color}</code> — จับคู่กับสีมงคลบริเวณประตู/หน้าบ้าน`);
  $('#fengResult').innerHTML = `<div>คำแนะนำ:</div><ul class="mb-0">${sugg.map(s=>`<li>${s}</li>`).join('')}</ul><div class="small text-muted mt-2">* ฮวงจุ้ยเป็นความเชื่อส่วนบุคคล ใช้ประกอบการตัดสินใจร่วมกับการออกแบบที่เหมาะสม</div>`;
}
export function bindFengEvents(){
  ['azimuth','style','colorMain','floors'].forEach(id=> document.getElementById(id)?.addEventListener('input', fengShui));
}
