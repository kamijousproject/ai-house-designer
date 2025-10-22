import { $ } from './ui.js';
let map, marker, geocoder, sunLines=[], windLine;
function clearLines(){ sunLines.forEach(l=>l.setMap(null)); sunLines=[]; if(windLine){ windLine.setMap(null); windLine=null; } }
function headingTo(offsetM, headingDeg){ return google.maps.geometry.spherical.computeOffset(marker.getPosition(), offsetM, headingDeg); }
function monsoonWind(date){
  const m = date.getMonth()+1;
  if(m>=5 && m<=10) return { from:225, to:45, name:'ตะวันตกเฉียงใต้ → ตะวันออกเฉียงเหนือ (SW Monsoon)' };
  if(m>=11 || m<=2) return { from:45,  to:225, name:'ตะวันออกเฉียงเหนือ → ตะวันตกเฉียงใต้ (NE Monsoon)' };
  return { from:180, to:0, name:'เปลี่ยนฤดู (ลมหัวปี-ปลายปี)' };
}
function sunHeadingAt(date, lat, lng){
  const pos = SunCalc.getPosition(date, lat, lng);
  return (pos.azimuth * 180/Math.PI + 180) % 360;
}
async function geocodeAddressString(addr){
  return new Promise((resolve,reject)=>{
    geocoder.geocode({ address: addr }, (res, status)=>{
      if(status==='OK' && res[0]) resolve(res[0].geometry.location);
      else reject(status);
    });
  });
}
async function geocodeFromForm(){
  const addr = [$('#address')?.value,$('#tambon')?.value,$('#amphoe')?.value,$('#province')?.value,'ประเทศไทย']
    .filter(Boolean).join(' ');
  return geocodeAddressString(addr);
}
function analyzeSunWind(){
  if(!map || !marker) return;
  clearLines();
  const ll = marker.getPosition();
  $('#latlngTxt').textContent = `${ll.lat().toFixed(6)}, ${ll.lng().toFixed(6)}`;
  const now = new Date();
  const times = SunCalc.getTimes(now, ll.lat(), ll.lng());
  const am = times.sunriseEnd || new Date(now.getFullYear(),now.getMonth(),now.getDate(),9,0);
  const pm = times.sunsetStart || new Date(now.getFullYear(),now.getMonth(),now.getDate(),15,0);
  const hAm = sunHeadingAt(am, ll.lat(), ll.lng());
  const hPm = sunHeadingAt(pm, ll.lat(), ll.lng());
  const sun1 = new google.maps.Polyline({ path:[ll, headingTo(200, hAm)], strokeColor:'#f59e0b', strokeWeight:4, map, icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale:2, strokeColor:'#f59e0b'}, offset:'100%'}]});
  const sun2 = new google.maps.Polyline({ path:[ll, headingTo(200, hPm)], strokeColor:'#ea580c', strokeWeight:4, map, icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale:2, strokeColor:'#ea580c'}, offset:'100%'}]});
  sunLines.push(sun1,sun2);
  const mon = monsoonWind(now);
  windLine = new google.maps.Polyline({ path:[ headingTo(150, mon.from), ll, headingTo(200, mon.to) ], strokeColor:'#38bdf8', strokeWeight:3, map, icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale:2, strokeColor:'#38bdf8'}, offset:'100%'}] });
  $('#sunTxt').textContent = `เช้า ${Math.round(hAm)}° / บ่าย ${Math.round(hPm)}°`;
  $('#windTxt').textContent = mon.name;
  const westish = (hPm>225 && hPm<315);
  const advice = [];
  if(westish) advice.push('เพิ่มกันสาด/ระแนงด้านตะวันตก ลดความร้อนบ่าย');
  if(mon.to>=30 && mon.to<=120) advice.push('เปิดช่องลมทิศ NE/E รับลมฤดูหนาว');
  if(mon.to>=210 && mon.to<=300) advice.push('เปิดช่องลมทิศ SW/W รับลมฤดูฝน');
  advice.push('วางทิศทางบ้านให้รับลม/หลบแดดเหมาะสม');
  $('#mapAdvice').textContent = advice.join(' · ');
}
export function initMap(){
  geocoder = new google.maps.Geocoder();
  const center = { lat: 13.736, lng: 100.523 };
  map = new google.maps.Map(document.getElementById('gmap'), { center, zoom: 16, mapTypeId:'hybrid' });
  marker = new google.maps.Marker({ position:center, map, draggable:true });
  marker.addListener('dragend', ()=> analyzeSunWind());
  analyzeSunWind();
  $('#btnGeocode')?.addEventListener('click', async ()=>{
    try{ const loc = await geocodeFromForm(); map.setCenter(loc); marker.setPosition(loc); analyzeSunWind(); }
    catch(e){ alert('หาแปลงไม่พบ ลองใส่ที่อยู่ให้ละเอียดขึ้น'); }
  });
  $('#btnMapAnalyze')?.addEventListener('click', analyzeSunWind);
}