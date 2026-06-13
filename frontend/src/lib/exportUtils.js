import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title, columns, data, filename) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const printReport = (title, columns, data) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  
  let tableHTML = `<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">`;
  tableHTML += `<thead><tr style="background-color: #f3f4f6;">`;
  columns.forEach(col => {
    tableHTML += `<th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">${col}</th>`;
  });
  tableHTML += `</tr></thead><tbody>`;
  
  data.forEach(row => {
    tableHTML += `<tr>`;
    row.forEach(cell => {
      tableHTML += `<td style="border: 1px solid #e5e7eb; padding: 8px;">${cell}</td>`;
    });
    tableHTML += `</tr>`;
  });
  tableHTML += `</tbody></table>`;

  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111827; }
          h1 { color: #1f2937; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${tableHTML}
        <div class="footer">Generated on: ${new Date().toLocaleString()}</div>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
