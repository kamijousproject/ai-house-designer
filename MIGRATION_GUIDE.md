# คู่มือการแปลงจาก HTML/PHP เป็น Next.js

## สิ่งที่เปลี่ยนแปลง

### 1. โครงสร้างโปรเจกต์

**เดิม (HTML/PHP):**
```
/
├── index.html
├── designer.html
├── boq.html
├── plan.html
├── map.html
├── permit.html
├── loan.html
├── feng.html
├── contractors.html
├── api/
│   ├── ai_design.php
│   └── config.php
└── assets/
```

**ใหม่ (Next.js):**
```
/
├── src/
│   ├── app/
│   │   ├── page.js (index.html)
│   │   ├── designer/page.js
│   │   ├── boq/page.js
│   │   ├── plan/page.js
│   │   ├── map/page.js
│   │   ├── permit/page.js
│   │   ├── loan/page.js
│   │   ├── feng/page.js
│   │   ├── contractors/page.js
│   │   └── api/ai-design/route.js
│   └── components/
├── public/ai-house-designer/assets/
└── package.json
```

### 2. การแปลง API

**เดิม (PHP):**
```php
// api/ai_design.php
<?php
header('Content-Type: application/json');
require __DIR__ . '/config.php';
// ... PHP code
```

**ใหม่ (Next.js API Route):**
```javascript
// src/app/api/ai-design/route.js
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
// ... JavaScript code
```

### 3. Routing

**เดิม:**
- `/ai-house-designer/index.html`
- `/ai-house-designer/designer.html`
- `/ai-house-designer/boq.html`

**ใหม่:**
- `/ai-house-designer/` (หน้าแรก)
- `/ai-house-designer/designer/`
- `/ai-house-designer/boq/`

### 4. การโหลด JavaScript Modules

**เดิม (HTML):**
```html
<script type="module" src="./assets/js/modules/threeScene.js"></script>
```

**ใหม่ (Next.js):**
```javascript
useEffect(() => {
  const script = document.createElement('script')
  script.src = '/ai-house-designer/assets/js/modules/threeScene.js'
  script.type = 'module'
  document.body.appendChild(script)
}, [])
```

### 5. Navigation

**เดิม (HTML):**
```html
<a href="/ai-house-designer/designer.html">Designer</a>
```

**ใหม่ (Next.js):**
```jsx
import Link from 'next/link'
<Link href="/designer">Designer</Link>
```

## ขั้นตอนการติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

คัดลอก `.env.local.example` เป็น `.env.local`:
```bash
copy .env.local.example .env.local
```

แก้ไขไฟล์ `.env.local` และใส่ API Key:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 3. รันโปรเจกต์

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## สิ่งที่ต้องทำเพิ่มเติม (Optional)

### 1. ลบไฟล์ HTML เก่า (หลังจากทดสอบแล้ว)

```bash
# ลบไฟล์ HTML เดิม
rm *.html

# ลบ PHP API เดิม
rm -rf api/
```

### 2. ติดตั้ง TypeScript (ถ้าต้องการ)

```bash
npm install --save-dev typescript @types/react @types/node
```

แล้วเปลี่ยนไฟล์ `.js` เป็น `.tsx`

### 3. ปรับปรุง JavaScript Modules

JavaScript modules ใน `/public/ai-house-designer/assets/js/` ยังคงใช้งานได้
แต่อาจต้องปรับให้เข้ากับ Next.js มากขึ้น:

- แปลงเป็น React Hooks
- ใช้ Next.js Image component
- ใช้ Next.js built-in features

## การทดสอบ

### ทดสอบหน้าต่างๆ

- [ ] หน้าแรก (/)
- [ ] Designer (/designer)
- [ ] BOQ (/boq)
- [ ] Plan (/plan)
- [ ] Map (/map)
- [ ] Permit (/permit)
- [ ] Loan (/loan)
- [ ] Feng (/feng)
- [ ] Contractors (/contractors)

### ทดสอบ Features

- [ ] Navigation ระหว่างหน้า
- [ ] AI Design API
- [ ] Three.js 3D Preview
- [ ] SVG Plan Generation
- [ ] BOQ Calculation
- [ ] Loan Calculator
- [ ] Export functions (CSV, PDF, PNG)

## ปัญหาที่อาจพบและวิธีแก้

### 1. Bootstrap JavaScript ไม่ทำงาน

**สาเหตุ:** Bootstrap ต้องการ DOM พร้อมใช้งาน

**แก้:** ใช้ `useEffect` โหลด Bootstrap หลังจาก component mount

### 2. Three.js Module ไม่โหลด

**สาเหตุ:** Path ไม่ถูกต้อง

**แก้:** ตรวจสอบว่าไฟล์อยู่ใน `/public/ai-house-designer/assets/vendor/three/`

### 3. localStorage ไม่ทำงาน (SSR)

**สาเหตุ:** Next.js รัน Server-Side Rendering

**แก้:** ใช้ `useEffect` และ check `typeof window !== 'undefined'`

```javascript
useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('key')
    // ...
  }
}, [])
```

### 4. API CORS Error

**สาเหตุ:** Next.js API Routes มี CORS ตั้งต้น

**แก้:** เพิ่ม CORS headers ถ้าจำเป็น (แต่ไม่จำเป็นสำหรับ same-origin)

## ข้อดีของการใช้ Next.js

1. ✅ **Performance** - Server-Side Rendering และ Static Generation
2. ✅ **SEO** - Meta tags และ OpenGraph ดีกว่า
3. ✅ **Developer Experience** - Hot reload, TypeScript support
4. ✅ **Deployment** - Deploy ง่ายบน Vercel, Netlify
5. ✅ **API Routes** - ไม่ต้องใช้ PHP server
6. ✅ **Code Organization** - Component-based architecture
7. ✅ **Security** - Environment variables ปลอดภัยกว่า

## การ Deploy

### Vercel (แนะนำ)

1. Push โค้ดไป GitHub
2. เชื่อมต่อ repository กับ Vercel
3. ตั้งค่า Environment Variables ใน Vercel Dashboard
4. Deploy!

### แบบอื่นๆ

- **Netlify:** รองรับ Next.js
- **AWS Amplify:** รองรับ Next.js
- **DigitalOcean App Platform:** รองรับ Next.js
- **Self-hosted:** รัน `npm run build && npm start`

## สรุป

การแปลงเป็น Next.js ทำให้:
- ⚡ เว็บไซต์เร็วขึ้น
- 🔍 SEO ดีขึ้น
- 🛠️ พัฒนาง่ายขึ้น
- 🚀 Deploy ง่ายขึ้น
- 🔐 ปลอดภัยขึ้น

ไฟล์ HTML/PHP เดิมยังคงอยู่เพื่อการอ้างอิง สามารถลบได้หลังจากทดสอบครบถ้วน
