// threeScene-standalone.js - เวอร์ชันที่ไม่ใช้ ES6 imports
// ใช้สำหรับ fallback เมื่อ module loading ล้มเหลว

// รอให้ Three.js โหลดเสร็จ
function waitForThreeJS() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkThree = () => {
      if (typeof THREE !== 'undefined') {
        console.log('✅ THREE.js is available');
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('THREE.js not loaded'));
      } else {
        attempts++;
        setTimeout(checkThree, 100);
      }
    };
    
    checkThree();
  });
}

/** คำนวณขนาดตัวบ้านจากขนาดที่ดินแบบง่ายๆ */
function baseDims(plotW, plotL) {
  const bldW = Math.min(plotW * 0.8, Math.max(1, plotW - 2));
  const bldL = Math.min(plotL * 0.7, Math.max(1, plotL - 3));
  return { bldW, bldL };
}

/** ล้างและกำจัด resource ในกลุ่ม/วัตถุ */
function clearObject3D(obj) {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) child.geometry.dispose?.();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m?.dispose?.());
      } else {
        child.material?.dispose?.();
      }
    }
  });
  while (obj.children.length) obj.remove(obj.children[0]);
}

/** ปรับกล้องให้ครอบโมเดลพอดี */
function fitCameraToObject(object, camera, controls) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let dist = (maxDim / 2) / Math.tan(fov / 2);
  dist *= 1.4; // margin
  camera.position.set(center.x + dist, center.y + dist * 0.7, center.z + dist);
  camera.near = Math.max(0.1, dist / 100);
  camera.far = Math.max(1000, dist * 100);
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
}

/**
 * สร้าง viewer 3D (standalone version)
 */
async function init3DStandalone(container, opts = {}) {
  console.log('🔧 Starting standalone 3D initialization...');
  
  // รอให้ THREE.js โหลดเสร็จ
  await waitForThreeJS();
  
  if (!container) throw new Error('threeScene: container ไม่ถูกต้อง');

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(container.clientWidth || 640, container.clientHeight || 480, false);
  
  // color/tone mapping
  if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // --- Scene ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background ?? 0x0b1020);

  // --- Camera & Controls ---
  const camera = new THREE.PerspectiveCamera(
    55,
    (container.clientWidth || 640) / (container.clientHeight || 480),
    0.1,
    4000
  );
  camera.position.set(30, 22, 28);

  // ใช้ OrbitControls จาก global THREE object
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // --- Lights ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 0.9));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(30, 50, 24);
  scene.add(dirLight);

  // --- Grid / Ground hint ---
  const grid = new THREE.GridHelper(400, 80, 0x2d3748, 0x1f2937);
  grid.position.y = 0;
  scene.add(grid);

  // --- Groups ---
  const root = new THREE.Group();
  scene.add(root);

  let plotMesh = null;

  // --- Render Loop ---
  let disposed = false;
  const render = () => {
    if (disposed) return;
    controls.update();
    renderer.render(scene, camera);
  };
  
  if (renderer.setAnimationLoop) {
    renderer.setAnimationLoop(render);
  } else {
    const loop = () => {
      if (disposed) return;
      requestAnimationFrame(loop);
      render();
    };
    loop();
  }

  // --- Resize ---
  const onResize = () => {
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 480;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(container);

  // --- Material cache ---
  const mats = {
    slab: new THREE.MeshStandardMaterial({ color: 0x334155 }),
    plot: new THREE.MeshStandardMaterial({ color: 0x132034, side: THREE.DoubleSide }),
    flatRoof: new THREE.MeshStandardMaterial({ color: 0x6b7280 }),
    coneRoof: new THREE.MeshStandardMaterial({ color: 0x8b5e34, roughness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9ec9ff, transparent: true, opacity: 0.72, transmission: 0.45, roughness: 0 }),
  };

  /** วาดโมเดลบ้านใหม่ตามพารามิเตอร์ */
  function build(params = {}) {
    const {
      plotW = 12,
      plotL = 20,
      floors = 2,
      floorH = 3,
      roofType = 'gable',
      color = '#e0e7ff',
    } = params;

    // เคลียร์ของเก่า
    clearObject3D(root);

    // ปรับ/สร้างแปลงที่ดิน
    if (!plotMesh) {
      plotMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(plotW, plotL),
        mats.plot
      );
      plotMesh.rotation.x = -Math.PI / 2;
      plotMesh.position.y = 0;
      scene.add(plotMesh);
    } else {
      plotMesh.geometry.dispose();
      plotMesh.geometry = new THREE.PlaneGeometry(plotW, plotL);
    }

    const { bldW, bldL } = baseDims(plotW, plotL);
    const H = Math.max(2.6, floors * floorH);

    // ฐานคอนกรีต
    {
      const geo = new THREE.BoxGeometry(bldW, 0.3, bldL);
      const mesh = new THREE.Mesh(geo, mats.slab);
      mesh.position.set(0, 0.15, 0);
      root.add(mesh);
    }

    // ตัวอาคาร
    {
      const geo = new THREE.BoxGeometry(bldW, H, bldL);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.82,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, H / 2 + 0.3, 0);
      root.add(mesh);
    }

    // หน้าต่าง
    {
      const winW = 1.2, winH = 1.0, winT = 0.08;
      for (let i = 0; i < 6; i++) {
        const geo = new THREE.BoxGeometry(winW, winH, winT);
        const win = new THREE.Mesh(geo, mats.glass);
        const side = (i % 2 === 0) ? 1 : -1;
        const posX = side * (bldW / 2 - 0.06);
        const posZ = (i < 3 ? -1 : 1) * ((i % 3) * (bldL / 3) - bldL / 3 + bldL / 6);
        win.position.set(posX, H / 2, posZ);
        win.rotation.y = side > 0 ? 0 : Math.PI;
        root.add(win);
      }
    }

    // หลังคา
    {
      const roofG = new THREE.Group();

      if (roofType === 'flat') {
        const geo = new THREE.BoxGeometry(bldW + 0.4, 0.3, bldL + 0.4);
        const flat = new THREE.Mesh(geo, mats.flatRoof);
        flat.position.y = H + 0.45;
        roofG.add(flat);
      } else {
        const ridgeH = (roofType === 'shed') ? 1.0 : 1.6;
        const r = Math.max(bldW, bldL) * 0.75;
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(r, ridgeH, 4),
          mats.coneRoof
        );
        cone.rotation.y = Math.PI / 4;
        cone.position.y = H + 0.3 + ridgeH / 2;
        if (roofType === 'shed') cone.rotation.x = Math.PI / 14;
        roofG.add(cone);
      }

      root.add(roofG);
    }

    // ปรับกล้องให้พอดีโมเดล
    fitCameraToObject(root, camera, controls);
  }

  /** ทำความสะอาด */
  function dispose() {
    disposed = true;
    ro.disconnect();
    if (renderer.setAnimationLoop) renderer.setAnimationLoop(null);
    clearObject3D(root);
    clearObject3D(scene);
    grid.geometry?.dispose?.();
    if (Array.isArray(grid.material)) grid.material.forEach((m) => m?.dispose?.());
    else grid.material?.dispose?.();
    if (plotMesh) {
      plotMesh.geometry?.dispose?.();
      if (Array.isArray(plotMesh.material)) plotMesh.material.forEach((m) => m?.dispose?.());
      else plotMesh.material?.dispose?.();
      scene.remove(plotMesh);
      plotMesh = null;
    }
    Object.values(mats).forEach((m) => m?.dispose?.());
    controls.dispose();
    renderer.dispose();
  }

  // เริ่มต้นด้วยโมเดลค่าเริ่มต้น
  build();

  console.log('✅ Standalone 3D viewer initialized');
  return { build, dispose, scene, camera, renderer };
}

// Export to window
if (typeof window !== 'undefined') {
  window.init3DStandalone = init3DStandalone;
  console.log('🎯 init3DStandalone function exported to window');
}
