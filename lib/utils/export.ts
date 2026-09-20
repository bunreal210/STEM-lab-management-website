export function downloadCSV(filename: string, rows: any[][]) {
  const processRow = (row: any[]) => {
    return row
      .map((val) => {
        const str = String(val === null || val === undefined ? '' : val)
        const escaped = str.replace(/"/g, '""')
        if (escaped.search(/("|,|\n)/g) >= 0) {
          return `"${escaped}"`
        }
        return escaped
      })
      .join(',')
  }

  const csvContent = rows.map(processRow).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function format24hTime(timeStr?: string | null): string {
  if (!timeStr) return ''
  const trimmed = timeStr.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (match) {
    const hh = match[1].padStart(2, '0')
    const mm = match[2]
    return `${hh}:${mm}`
  }
  return trimmed
}

export function isDateInRange(itemDateStr?: string | null, startDate?: string, endDate?: string): boolean {
  if (!itemDateStr) return true
  
  let ymd = ''
  if (itemDateStr.includes('T')) {
    const d = new Date(itemDateStr)
    if (isNaN(d.getTime())) return true
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    ymd = `${y}-${m}-${day}`
  } else if (/^\d{4}-\d{2}-\d{2}/.test(itemDateStr)) {
    ymd = itemDateStr.substring(0, 10)
  } else {
    const d = new Date(itemDateStr)
    if (isNaN(d.getTime())) return true
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    ymd = `${y}-${m}-${day}`
  }

  if (startDate && ymd < startDate) return false
  if (endDate && ymd > endDate) return false
  return true
}
