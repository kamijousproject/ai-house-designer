# 🚀 เริ่มต้นใช้งาน AI House Designer (Next.js)

## ✅ การติดตั้งเสร็จสมบูรณ์!

โปรเจกต์ของคุณถูกแปลงเป็น Next.js เรียบร้อยแล้ว

## 📋 ขั้นตอนการเริ่มต้น

### 1. ตั้งค่า OpenAI API Key (สำคัญ!)

คัดลอกไฟล์ตัวอย่าง:
```bash
copy .env.local.example .env.local
```

แก้ไขไฟล์ `.env.local` และใส่ API Key ของคุณ:
```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

💡 **ยังไม่มี API Key?** 
- ไปที่ https://platform.openai.com/api-keys
- สร้าง API Key ใหม่
- คัดลอกและใส่ในไฟล์ `.env.local`

### 2. รันโปรเจกต์

**Development Mode (แนะนำสำหรับการพัฒนา):**
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่: **http://localhost:3000/ai-house-designer/**

**Production Mode:**
```bash
npm run build
npm start
```

## 📁 โครงสร้างโปรเจกต์

```
ai-house-designer/
├── src/
│   ├── app/                    # หน้าเว็บทั้งหมด
│   │   ├── page.js            # หน้าแรก
│   │   ├── designer/          # Designer + 3D Preview
│   │   ├── boq/               # คำนวณ BOQ
│   │   ├── plan/              # แบบแปลน SVG
│   │   ├── map/               # แผนที่/แดดลม
│   │   ├── permit/            # ขออนุญาต
│   │   ├── loan/              # สินเชื่อ
│   │   ├── feng/              # ฮวงจุ้ย
│   │   ├── contractors/       # ผู้รับเหมา
│   │   └── api/
│   │       └── ai-design/     # API สำหรับ AI
│   └── components/            # React Components
│       ├── Navbar.js
│       ├── Footer.js
│       └── HeroCarousel.js
├── public/
│   └── ai-house-designer/
│       └── assets/            # CSS, JS, Images (จากโปรเจกต์เดิม)
├── package.json
├── next.config.js
└── README.md
```

## 🎯 หน้าที่สามารถเข้าถึงได้

- 🏠 หน้าแรก: `/ai-house-designer/`
- 🎨 Designer: `/ai-house-designer/designer/`
- 💰 BOQ: `/ai-house-designer/boq/`
- 📐 แบบแปลน: `/ai-house-designer/plan/`
- 🗺️ แผนที่: `/ai-house-designer/map/`
- 📄 ขออนุญาต: `/ai-house-designer/permit/`
- 💳 สินเชื่อ: `/ai-house-designer/loan/`
- ☯️ ฮวงจุ้ย: `/ai-house-designer/feng/`
- 👷 ผู้รับเหมา: `/ai-house-designer/contractors/`

## 🔧 คำสั่งที่มีให้ใช้

```bash
npm run dev      # รัน development server
npm run build    # Build สำหรับ production
npm start        # รัน production server
npm run lint     # ตรวจสอบ code quality
```

## ⚠️ หมายเหตุสำคัญ

### ไฟล์เดิมที่ยังมีอยู่:

ไฟล์ HTML/PHP เดิมยังคงอยู่ในโฟลเดอร์หลัก:
- `index.html`
- `designer.html`
- `boq.html`
- ฯลฯ

**คุณสามารถลบไฟล์เหล่านี้ได้หลังจากทดสอบ Next.js version แล้ว**

### JavaScript Modules:

JavaScript modules ใน `/public/ai-house-designer/assets/js/` ยังคงใช้งานได้ปกติ
โปรเจกต์จะโหลดไฟล์เหล่านี้ผ่าน Next.js

## 🐛 แก้ปัญหาเบื้องต้น

### ❌ ปัญหา: หน้าเว็บไม่แสดง

**วิธีแก้:**
1. ตรวจสอบว่ารัน `npm run dev` แล้ว
2. เปิดที่ `http://localhost:3000/ai-house-designer/` (ต้องมี `/ai-house-designer/`)
3. ตรวจสอบ Console ใน browser (F12)

### ❌ ปัญหา: API ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบว่าตั้งค่า `OPENAI_API_KEY` ใน `.env.local` แล้ว
2. Restart dev server หลังจากเปลี่ยน .env
3. ตรวจสอบว่า API Key ถูกต้อง

### ❌ ปัญหา: Three.js ไม่โหลด

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์อยู่ที่ `/public/ai-house-designer/assets/vendor/three/`
2. เปิด Console ดู error messages
3. ตรวจสอบ path ในไฟล์ `/src/app/designer/page.js`

### ❌ ปัญหา: รูปภาพไม่แสดง

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์อยู่ใน `/public/ai-house-designer/assets/images/`
2. Path ต้องเริ่มด้วย `/ai-house-designer/`

## 📚 เอกสารเพิ่มเติม

- `README.md` - ข้อมูลโปรเจกต์โดยละเอียด
- `MIGRATION_GUIDE.md` - คู่มือการแปลงจาก HTML/PHP
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

## 🎉 พร้อมใช้งาน!

รัน `npm run dev` แล้วเปิด http://localhost:3000/ai-house-designer/

---

**พัฒนาโดย:** Forward Studio  
**เวอร์ชัน:** Next.js 14 (Converted from HTML/PHP)
