import { Kanit } from 'next/font/google'
import './globals.css'

const kanit = Kanit({ 
  weight: ['300', '400', '600', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
})

export const metadata = {
  title: 'AI House Designer — เริ่มไอเดียบ้านในไม่กี่คลิก | Forward Studio',
  description: 'กำหนดที่ดิน เลือกสไตล์ พรีวิว 3D สร้างแบบแปลนและ BOQ อัตโนมัติ พร้อมแผนที่วิเคราะห์แดด/ลม — พัฒนาโดย Forward Studio',
  openGraph: {
    title: 'AI House Designer — Forward Studio',
    description: 'เริ่มไอเดียบ้านในไม่กี่คลิก พรีวิว 3D | แปลน | BOQ | แผนที่แดดลม',
    type: 'website',
    url: 'https://forwardstudio.co.th/ai-house-designer/',
    images: ['/ai-house-designer/assets/images/og/cover.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="th" data-bs-theme="dark">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" 
          rel="stylesheet" 
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </head>
      <body className={kanit.className} data-page="home">
        {children}
      </body>
    </html>
  )
}
