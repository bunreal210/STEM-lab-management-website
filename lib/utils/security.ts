/**
 * STEM Lab Security & Data Sanitization Utility
 * Cung cấp các hàm làm sạch dữ liệu, chống tấn công XSS, SSRF, Email Header Injection & Rate Limiting.
 */

// ── 1. INPUT SANITIZATION (Chống XSS & Script Injection) ──
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return ''
    return String(input)
  }

  return input
    // Loại bỏ các thẻ HTML script, iframe, object, embed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Loại bỏ các thuộc tính event handler nguy hiểm: onload, onerror, onclick, onmouseover...
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    // Loại bỏ javascript: pseudo-protocol
    .replace(/javascript:/gi, '')
    .trim()
}

// ── 2. EMAIL VALIDATION & HEADER INJECTION DEFENSE ──
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Làm sạch tiêu đề Email chống Email Header Injection / SMTP Splitting
 */
export function sanitizeEmailSubject(subject: string): string {
  if (!subject || typeof subject !== 'string') return ''
  return subject
    .replace(/[\r\n\t]/g, ' ') // Xóa ký tự xuống dòng ngăn chặn Header Injection
    .slice(0, 200) // Giới hạn độ dài tối đa 200 ký tự
    .trim()
}

// ── 3. URL VALIDATION & SSRF DEFENSE (Bảo vệ Webhook & External Links) ──
const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^0\.0\.0\.0$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Link-local / Cloud metadata (AWS/GCP/Azure)
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
]

export function isValidSafeUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false
  try {
    const parsed = new URL(urlStr.trim())
    // Chỉ chấp nhận giao thức an toàn HTTPS hoặc HTTP (khuyến khích HTTPS)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false
    }

    const hostname = parsed.hostname.toLowerCase()

    // Chặn truy cập địa chỉ IP nội bộ / localhost chống SSRF
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

// ── 4. PASSWORD STRENGTH VALIDATION ──
export interface PasswordStrength {
  score: number // 0 -> 4
  label: 'Rất yếu' | 'Yếu' | 'Trung bình' | 'Mạnh' | 'Rất mạnh'
  color: string
  isAcceptable: boolean
  feedback: string[]
}

export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = []
  if (!password) {
    return { score: 0, label: 'Rất yếu', color: 'bg-slate-200', isAcceptable: false, feedback: ['Vui lòng nhập mật khẩu'] }
  }

  let score = 0

  if (password.length >= 6) score += 1
  else feedback.push('Độ dài tối thiểu 6 ký tự')

  if (password.length >= 10) score += 1

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Nên có cả chữ hoa và chữ thường')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Nên có ít nhất 1 chữ số (0-9)')
  }

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1
  }

  // Normalize score to 0..4
  const normalizedScore = Math.min(Math.max(score - 1, 0), 4)

  const map: Record<number, { label: PasswordStrength['label']; color: string }> = {
    0: { label: 'Rất yếu', color: 'bg-rose-500' },
    1: { label: 'Yếu', color: 'bg-orange-500' },
    2: { label: 'Trung bình', color: 'bg-amber-500' },
    3: { label: 'Mạnh', color: 'bg-sky-500' },
    4: { label: 'Rất mạnh', color: 'bg-emerald-500' },
  }

  const { label, color } = map[normalizedScore]

  return {
    score: normalizedScore,
    label,
    color,
    isAcceptable: password.length >= 6,
    feedback,
  }
}

// ── 5. EDGE IN-MEMORY RATE LIMITER (Chống DoS & Spam API) ──
interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

/**
 * Sliding window in-memory rate limiter cho Next.js Edge Runtime
 * @param key Khóa định danh (IP hoặc User ID)
 * @param limit Số lượt tối đa được phép trong cửa sổ thời gian
 * @param windowMs Khoảng thời gian tính bằng mili-giây (ví dụ: 60000ms = 1 phút)
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  // Xóa bớt các bản ghi cũ khi map quá lớn (tránh tràn bộ nhớ)
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) {
        rateLimitMap.delete(k)
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetInMs: Math.max(0, record.resetTime - now) }
  }

  record.count += 1
  return { allowed: true, remaining: limit - record.count, resetInMs: Math.max(0, record.resetTime - now) }
}
