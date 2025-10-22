export const $ = (q)=>document.querySelector(q);
export const $$ = (q)=>document.querySelectorAll(q);
export const niceInt = (n)=> Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0});
export function toast(msg,type='info'){
  const box = document.createElement('div');
  box.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
  box.role = "alert"; box.ariaLive="assertive"; box.ariaAtomic="true";
  box.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(box);
  new bootstrap.Toast(box,{delay:2200}).show();
  setTimeout(()=>box.remove(),2600);
}