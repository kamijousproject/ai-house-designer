// init.js - เรียกใช้งาน 3D scene เมื่อหน้าเว็บโหลดเสร็จ (พร้อม progress indicator)
import { init3D } from './threeScene.js';

// ฟังก์ชันแสดง progress
function updateProgress(percent, message) {
  const viewport = document.getElementById('viewport');
  if (viewport) {
    viewport.innerHTML = `
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="progress mb-2" style="width: 200px;">
            <div class="progress-bar" role="progressbar" style="width: ${percent}%" 
                 aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
              ${percent}%
            </div>
          </div>
          <div class="small text-muted">${message}</div>
        </div>
      </div>
    `;
  }
}

// รอให้ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 กำลังเริ่มต้น 3D Viewer...');
  
  // หา viewport container
  const viewport = document.getElementById('viewport');
  if (!viewport) {
    console.warn('⚠️ ไม่พบ viewport container');
    return;
  }

  try {
    // แสดง progress ขั้นตอนต่าง ๆ
    updateProgress(10, 'กำลังเตรียม 3D Engine...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    updateProgress(30, 'กำลังโหลด Three.js...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateProgress(50, 'กำลังสร้าง Scene...');
    
    // เริ่มต้น 3D scene
    const viewer3D = await init3D(viewport, {
      background: 0x0b1020
    });
    
    updateProgress(70, 'กำลังสร้างโมเดล...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    updateProgress(90, 'กำลังปรับแต่งการแสดงผล...');
    
    console.log('✅ 3D Viewer เริ่มต้นสำเร็จ');
    
    // ฟังก์ชันอัพเดทโมเดลเมื่อมีการเปลี่ยนแปลงพารามิเตอร์
    window.updateHouseModel = (params) => {
      console.log('🏠 อัพเดทโมเดลบ้าน:', params);
      viewer3D.build(params);
    };
    
    // สร้างโมเดลเริ่มต้น
    const defaultParams = {
      plotW: 12,
      plotL: 20,
      floors: 2,
      floorH: 3,
      roofType: 'gable',
      color: '#e0e7ff'
    };
    
    viewer3D.build(defaultParams);
    
    updateProgress(100, 'เสร็จสิ้น!');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // เคลียร์ loading และแสดง 3D scene
    viewport.innerHTML = '';
    viewport.appendChild(viewer3D.renderer.domElement);
    
    // เก็บ reference สำหรับใช้งานภายหลัง
    window.viewer3D = viewer3D;
    
    console.log('🎉 3D Viewer พร้อมใช้งาน');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเริ่มต้น 3D Viewer:', error);
    viewport.innerHTML = `
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="text-center text-danger">
          <i class="fa-solid fa-exclamation-triangle fa-2xl mb-2"></i>
          <div>เกิดข้อผิดพลาดในการโหลด 3D Viewer</div>
          <small class="text-muted">${error.message}</small>
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary" onclick="location.reload()">
              <i class="fa-solid fa-refresh me-1"></i>
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    `;
  }
});

// ฟังก์ชันสำหรับอัพเดทโมเดลจากข้อมูลฟอร์ม
window.updateModelFromForm = () => {
  // ดึงค่าจากฟอร์ม (ถ้ามี global variables)
  if (typeof window.updateHouseModel === 'function') {
    const params = {
      plotW: window.plotW || 12,
      plotL: window.plotL || 20,
      floors: window.floors || 2,
      floorH: window.floorH || 3,
      roofType: window.roofType || 'gable',
      color: window.color || '#e0e7ff'
    };
    window.updateHouseModel(params);
  }
};
