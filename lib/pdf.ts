import jsPDF from 'jspdf';

export const generatePDF = (
  formattedNote: string,
  clientName?: string,
  template?: string
): string => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Shift Note Report', 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  const currentDate = new Date().toLocaleDateString('en-AU');
  doc.text(`Generated: ${currentDate}`, 20, 35);
  
  if (clientName) {
    doc.text(`Client: ${clientName}`, 20, 45);
  }
  
  if (template) {
    doc.text(`Template: ${template}`, 20, 55);
  }
  
  // Add line separator
  doc.line(20, 65, 190, 65);
  
  // Add formatted note content
  doc.setFontSize(11);
  const splitNote = doc.splitTextToSize(formattedNote, 170);
  doc.text(splitNote, 20, 80);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated by ShiftNote AI - Page ${i} of ${pageCount}`,
      20,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Add disclaimer
  doc.setFontSize(8);
  doc.text(
    'Disclaimer: This document was generated by ShiftNote AI. Please review for accuracy before use in professional settings.',
    20,
    doc.internal.pageSize.height - 25
  );
  
  return doc.output('datauristring');
};
