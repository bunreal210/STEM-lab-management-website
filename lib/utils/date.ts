/** Cached locale formatter – constructed once, reused on every call */
const VI_DATE_FORMAT = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/**
 * Format an ISO date string or null as dd/MM/yyyy (Vietnamese locale).
 * Returns an empty string for null/undefined/invalid inputs.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''
  return VI_DATE_FORMAT.format(date)
}

/**
 * Return the ISO date portion (YYYY-MM-DD) of a string or Date.
 */
export function formatIsoDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  // Use UTC-aware ISO slice to avoid off-by-one errors in timezones behind UTC
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Return the Vietnamese relative time string for a date (e.g. "3 ngày trước").
 */
const VI_RELATIVE = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' })

export function relativeTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  const diffMs = date.getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHr / 24)

  if (Math.abs(diffSec) < 60) return VI_RELATIVE.format(diffSec, 'second')
  if (Math.abs(diffMin) < 60) return VI_RELATIVE.format(diffMin, 'minute')
  if (Math.abs(diffHr) < 24) return VI_RELATIVE.format(diffHr, 'hour')
  return VI_RELATIVE.format(diffDay, 'day')
}
