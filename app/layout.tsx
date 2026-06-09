import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STEM LAB – THPT Bắc Đông Quan',
  description: 'Hệ thống quản lý & vận hành phòng STEM Laboratory THPT Bắc Đông Quan. Không gian sáng tạo Robotics, AI, IoT, Lập trình và Nghiên cứu khoa học kỹ thuật.',
  keywords: ['STEM', 'Bắc Đông Quan', 'Robotics', 'Arduino', 'PetroVietnam'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
