import { NextResponse } from 'next/server'
import { checkRateLimit, isValidEmail, sanitizeEmailSubject } from '@/lib/utils/security'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'anonymous-client'

    const rateLimit = checkRateLimit(`send-email:${clientIp}`, 10, 60000)
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

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')

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

    let body: Record<string, unknown>
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

    const recipient = String(to).trim()
    if (!isValidEmail(recipient)) {
      return NextResponse.json(
        { error: 'Địa chỉ email người nhận không đúng định dạng hợp lệ.' },
        { status: 400 }
      )
    }

    const cleanSubject = sanitizeEmailSubject(String(subject))
    if (!cleanSubject) {
      return NextResponse.json({ error: 'Tiêu đề email không được để trống.' }, { status: 400 })
    }

    const cleanHtml = String(html)
    if (cleanHtml.length > 60000) {
      return NextResponse.json({ error: 'Nội dung email vượt quá giới hạn dung lượng cho phép.' }, { status: 413 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu gửi email.'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
