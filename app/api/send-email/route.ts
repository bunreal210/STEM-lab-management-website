import { NextResponse } from 'next/server'

export const runtime = 'edge'


export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Thiếu thông tin người nhận (to), tiêu đề (subject) hoặc nội dung (html).' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('CẢNH BÁO: Chưa cấu hình biến môi trường RESEND_API_KEY trong file .env.local')
      return NextResponse.json(
        { error: 'Chưa cấu hình API Key cho dịch vụ gửi mail (RESEND_API_KEY).' },
        { status: 500 }
      )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'STEM Lab THPT Bắc Đông Quan <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const resData = await res.json()

    if (!res.ok) {
      console.error('Lỗi Resend API:', resData)
      return NextResponse.json(
        { error: resData.message || 'Không thể gửi email qua Resend.' },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Đã gửi email thành công.', data: resData })
  } catch (error: any) {
    console.error('Lỗi API Route /api/send-email:', error)
    return NextResponse.json({ error: error.message || 'Lỗi xử lý server.' }, { status: 500 })
  }
}
