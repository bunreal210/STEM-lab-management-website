export function downloadCSV(filename: string, rows: any[][]) {
  // Convert rows to CSV string
  const processRow = (row: any[]) => {
    return row
      .map((val) => {
        const str = String(val === null || val === undefined ? '' : val)
        // Escape quotes
        const escaped = str.replace(/"/g, '""')
        // Wrap in quotes if it contains comma, quote, or newline
        if (escaped.search(/("|,|\n)/g) >= 0) {
          return `"${escaped}"`
        }
        return escaped
      })
      .join(',')
  }

  const csvContent = rows.map(processRow).join('\n')
  
  // Add UTF-8 BOM so Excel opens it with correct encoding for Vietnamese characters
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
