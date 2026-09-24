import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'STEM LAB – THPT Bắc Đông Quan',
  description:
    'Hệ thống quản lý & vận hành phòng STEM Laboratory THPT Bắc Đông Quan. Không gian sáng tạo Robotics, AI, IoT, Lập trình và Nghiên cứu khoa học kỹ thuật.',
  keywords: ['STEM', 'Bắc Đông Quan', 'Robotics', 'Arduino', 'PetroVietnam'],
  authors: [{ name: 'Phạm Công Vinh' }],
  robots: 'index, follow',
  openGraph: {
    title: 'STEM LAB – THPT Bắc Đông Quan',
    description: 'Hệ thống quản lý & vận hành phòng STEM Laboratory THPT Bắc Đông Quan.',
    locale: 'vi_VN',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0284c7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  )
}
