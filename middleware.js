import { NextResponse } from 'next/server'

export function middleware(request) {
  // ถ้าเข้าที่ root path ให้ redirect ไป /ai-house-designer/
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/ai-house-designer/', request.url))
  }
}

export const config = {
  matcher: '/',
}
