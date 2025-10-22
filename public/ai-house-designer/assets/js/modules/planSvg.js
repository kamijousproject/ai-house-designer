import { areas } from './compute.js';
export function drawPlan(svg, cfg){
  const {plotW,plotL,floors,floorH,roofType} = cfg;
  svg.innerHTML='';
  const margin=60,W=794,H=1123, box={x:margin,y:margin+20,w:W-margin*2,h:H-margin*2-120};
  const t=(s,x,y,fs=16,w='600')=>{ const el=document.createElementNS('http://www.w3.org/2000/svg','text');
    el.setAttribute('x',x); el.setAttribute('y',y); el.setAttribute('font-size',fs); el.setAttribute('font-family','Kanit'); el.setAttribute('font-weight',w); el.textContent=s; svg.appendChild(el); };
  const R=(x,y,w,h)=>{ const r=document.createElementNS('http://www.w3.org/2000/svg','rect'); r.setAttribute('x',x); r.setAttribute('y',y);
    r.setAttribute('width',w); r.setAttribute('height',h); r.setAttribute('fill','#fff'); r.setAttribute('stroke','#1f2937'); r.setAttribute('stroke-width','1.5'); svg.appendChild(r); };
  R(margin,margin,W-margin*2,H-margin*2); t('แบบแปลนมาตรฐาน (ร่าง) — สเกล 1:100',margin+4,margin-8,16,'600');
  const { bldW,bldL } = areas({plotW,plotL,floors,floorH,roofType});
  const s = Math.min((box.w-60)/bldW,(box.h-100)/bldL), origin={x: box.x + (box.w - bldW*s)/2, y: box.y + 40};
  const B=document.createElementNS('http://www.w3.org/2000/svg','rect');
  B.setAttribute('x',origin.x); B.setAttribute('y',origin.y); B.setAttribute('width',bldW*s); B.setAttribute('height',bldL*s);
  B.setAttribute('fill','#f8fafc'); B.setAttribute('stroke','#111827'); B.setAttribute('stroke-width','2'); svg.appendChild(B);
  t(`ขนาดอาคารโดยประมาณ: ${bldW.toFixed(1)} x ${bldL.toFixed(1)} ม.`, margin+8, H - margin - 70, 14, '400');
}
export function downloadPlanPNG(svg){
  const data = new XMLSerializer().serializeToString(svg);
  const img = new Image(); const url = URL.createObjectURL(new Blob([data],{type:'image/svg+xml'}));
  img.onload = ()=>{
    const w=svg.viewBox.baseVal.width||svg.width.baseVal.value||794, h=svg.viewBox.baseVal.height||svg.height.baseVal.value||1123;
    const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h); URL.revokeObjectURL(url);
    c.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='plan_forward_studio.png'; a.click(); },'image/png',1);
  };
  img.src=url;
}