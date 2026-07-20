import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  // Make the element temporarily visible for html2canvas to capture it properly if it was hidden
  const originalStyle = element.style.cssText
  element.style.display = 'block'
  element.style.position = 'absolute'
  element.style.top = '-9999px' // move off-screen
  element.style.left = '0'
  element.style.width = '1000px' // fixed width for consistency
  element.style.backgroundColor = 'white'

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // higher resolution
      useCORS: true,
      logging: false,
      windowWidth: 1000,
    })

    const imgData = canvas.toDataURL('image/png')
    
    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    // Add subsequent pages if content is taller than A4
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    // Restore original style
    element.style.cssText = originalStyle
  }
}
