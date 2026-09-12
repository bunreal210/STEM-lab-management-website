import { NextResponse } from 'next/server'
import { checkRateLimit, isValidEmail, sanitizeEmailSubject } from '@/lib/utils/security'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    // ── 1. RATE LIMITING (Chống spam DoS & cạn kiệt quota API) ──
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'anonymous-client'

    const rateLimit = checkRateLimit(`send-email:${clientIp}`, 10, 60000) // Tối đa 10 email / phút / IP
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Bạn đã gửi quá nhiều yêu cầu email trong thời gian ngắn. Vui lòng thử lại sau giây lát.',
          retryAfterMs: rateLimit.resetInMs,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.resetInMs / 1000)),
          },
        }
      )
    }

    // ── 2. AUTHENTICATION TOKEN CHECK (Tùy chọn xác thực người dùng) ──
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')

    // Nếu có token gửi kèm, có thể xác thực tính hợp lệ của session qua Supabase
    if (token) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
          console.warn('Cảnh báo token xác thực không hợp lệ trong /api/send-email')
        }
      }
    }

    // ── 3. INPUT VALIDATION & SANITIZATION ──
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Định dạng JSON gửi lên không hợp lệ.' }, { status: 400 })
    }

    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc: người nhận (to), tiêu đề (subject) hoặc nội dung (html).' },
        { status: 400 }
      )
    }

    // Kiểm tra định dạng Email người nhận
    const recipient = String(to).trim()
    if (!isValidEmail(recipient)) {
      return NextResponse.json(
        { error: 'Địa chỉ email người nhận không đúng định dạng hợp lệ.' },
        { status: 400 }
      )
    }

    // Làm sạch tiêu đề chống Email Header Injection
    const cleanSubject = sanitizeEmailSubject(String(subject))
    if (!cleanSubject) {
      return NextResponse.json({ error: 'Tiêu đề email không được để trống.' }, { status: 400 })
    }

    // Giới hạn kích thước nội dung HTML (tối đa 60KB để tránh payload lớn)
    const cleanHtml = String(html)
    if (cleanHtml.length > 60000) {
      return NextResponse.json({ error: 'Nội dung email vượt quá giới hạn dung lượng cho phép.' }, { status: 413 })
    }

    // ── 4. RESEND API CONFIGURATION ──
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('CẢNH BÁO: Chưa cấu hình biến môi trường RESEND_API_KEY')
      return NextResponse.json(
        { error: 'Chưa cấu hình dịch vụ gửi email (RESEND_API_KEY).' },
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
        to: [recipient],
        subject: cleanSubject,
        html: cleanHtml,
      }),
    })

    const resData = await res.json()

    if (!res.ok) {
      console.error('Lỗi Resend API:', resData)
      return NextResponse.json(
        { error: resData.message || 'Không thể gửi email qua dịch vụ Resend.' },
        { status: res.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gửi email thông báo an toàn thành công.',
      data: { id: resData.id },
    })
  } catch (error: any) {
    console.error('Lỗi API Route /api/send-email:', error)
    return NextResponse.json({ error: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu gửi email.' }, { status: 500 })
  }
}
