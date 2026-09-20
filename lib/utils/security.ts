export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return ''
    return String(input)
  }

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false
  return EMAIL_REGEX.test(email.trim())
}

export function sanitizeEmailSubject(subject: string): string {
  if (!subject || typeof subject !== 'string') return ''
  return subject
    .replace(/[\r\n\t]/g, ' ')
    .slice(0, 200)
    .trim()
}

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^0\.0\.0\.0$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
]

export function isValidSafeUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false
  try {
    const parsed = new URL(urlStr.trim())
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false
    }

    const hostname = parsed.hostname.toLowerCase()
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

export interface PasswordStrength {
  score: number
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

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

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
