// EXPORT.JS - Dodatne opcije za export podataka
// PDF, Print, više formata

class DataExporter {
  static formatDate(dateValue) {
    if (!dateValue) return '';
    const dateText = String(dateValue).slice(0, 10);
    const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : dateValue;
  }
  
  // Export u PDF (potrebna eksterne biblioteke)
  static exportToPDF() {
    const cameras = storage.getAllCameras();
    
    // Osnovna struktura za PDF generiranje
    const pdfContent = {
      title: 'Evidencija Kamera Modrica',
      generated: this.formatDate(new Date().toISOString()),
      totalCameras: cameras.length,
      data: cameras
    };

    console.log('📄 PDF Export je pripremljen. Trebate biblioteku kao pdfkit ili jsPDF:');
    console.log('  npm install jspdf');
    console.log('  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>');
    
    return pdfContent;
  }

  // Export u Excel format (CSV sa dodatnim opcijama)
  static exportToExcel() {
    const cameras = storage.getAllCameras();
    
    // Excel kompatibilan CSV sa BOM za UTF-8
    const BOM = '\uFEFF';
    const headers = [
      'ID',
      'Naziv objekta',
      'Ulica',
      'Kvaliteta',
      'Dana čuvanja',
      'Status',
      'Datum provjere statusa',
      'Vlasnik',
      'Telefon',
      'Email',
      'Broj kamera',
      'Kategorija',
      'Sigurnosni nivo',
      'Napomene',
      'Zadnja pregleda'
    ];

    const rows = cameras.map(cam => [
      cam.id,
      this.escapeCSV(cam.objectName),
      this.escapeCSV(cam.street),
      cam.quality,
      cam.retentionDays,
      cam.status,
      this.formatDate(cam.statusCheckDate || cam.installDate),
      this.escapeCSV(cam.owner || ''),
      cam.phone || '',
      cam.email || '',
      cam.cameraCount,
      cam.category || '',
      cam.securityLevel || '',
      this.escapeCSV(cam.notes || ''),
      this.formatDate(cam.lastMaintenance)
    ]);

    const csv = BOM + headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    
    return this.downloadFile(csv, 'kamera_evidencija.csv', 'text/csv;charset=utf-8;');
  }

  // Pripremi podatke za spisak
  static exportToPrint() {
    const cameras = storage.getAllCameras();
    const stats = storage.getStatistics();

    let htmlContent = `
      <html>
      <head>
        <title>Evidencija Kamera - Modrica</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          .stats { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #2c3e50; color: white; padding: 10px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .status { padding: 5px 10px; border-radius: 3px; font-weight: bold; }
          .status-aktivna { background: #d4edda; color: #27ae60; }
          .status-neaktivna { background: #e2e3e5; color: #6c757d; }
          .status-neispravna { background: #f8d7da; color: #e74c3c; }
          .generated { color: #7f8c8d; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>📷 Evidencija Kamera Modrica</h1>
        <p>Generirano: ${this.formatDate(new Date().toISOString())}</p>
        
        <h3>Statistika</h3>
          <p>Ukupno kamera: ${stats.totalCameras}</p>
          <p>Aktivne kamere: ${stats.activeCount}</p>
          <p>Ulice sa kamerama: ${stats.totalStreets}</p>
          <p>Prosečno vreme čuvanja: ${stats.averageRetentionDays} dana</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Naziv objekta</th>
              <th>Ulica</th>
              <th>Kvaliteta</th>
              <th>Čuvanje (dana)</th>
              <th>Status</th>
              <th>Vlasnik</th>
              <th>Telefon</th>
            </tr>
          </thead>
          <tbody>
            ${cameras.map(cam => `
              <tr>
                <td>${cam.objectName}</td>
                <td>${cam.street}</td>
                <td>${cam.quality}</td>
                <td>${cam.retentionDays}</td>
                <td><span class="status status-${cam.status}">${cam.status}</span></td>
                <td>${cam.owner || '-'}</td>
                <td>${cam.phone || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="generated">
          <p>Dokument je generisan iz Sistema za evidenciju kamera Modrica</p>
          <p>Verzija: 1.0.0 | Datum: ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  }

  // Export u XML
  static exportToXML() {
    const cameras = storage.getAllCameras();
    
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<evidencija_kamera>\n`;
    xmlContent += `  <metadata>\n`;
    xmlContent += `    <title>Evidencija Kamera Modrica</title>\n`;
    xmlContent += `    <generated>${new Date().toISOString()}</generated>\n`;
    xmlContent += `    <total_cameras>${cameras.length}</total_cameras>\n`;
    xmlContent += `  </metadata>\n`;
    xmlContent += `  <cameras>\n`;

    cameras.forEach(cam => {
      xmlContent += `    <camera>\n`;
      xmlContent += `      <id>${cam.id}</id>\n`;
      xmlContent += `      <objectName>${this.escapeXML(cam.objectName)}</objectName>\n`;
      xmlContent += `      <street>${this.escapeXML(cam.street)}</street>\n`;
      xmlContent += `      <quality>${cam.quality}</quality>\n`;
      xmlContent += `      <retentionDays>${cam.retentionDays}</retentionDays>\n`;
      xmlContent += `      <status>${cam.status}</status>\n`;
      xmlContent += `      <statusCheckDate>${this.formatDate(cam.statusCheckDate || cam.installDate)}</statusCheckDate>\n`;
      xmlContent += `      <owner>${this.escapeXML(cam.owner || '')}</owner>\n`;
      xmlContent += `      <phone>${cam.phone || ''}</phone>\n`;
      xmlContent += `      <email>${cam.email || ''}</email>\n`;
      xmlContent += `      <cameraCount>${cam.cameraCount}</cameraCount>\n`;
      xmlContent += `      <category>${cam.category || ''}</category>\n`;
      xmlContent += `      <securityLevel>${cam.securityLevel || ''}</securityLevel>\n`;
      xmlContent += `      <notes>${this.escapeXML(cam.notes || '')}</notes>\n`;
      xmlContent += `      <lastMaintenance>${this.formatDate(cam.lastMaintenance)}</lastMaintenance>\n`;
      xmlContent += `    </camera>\n`;
    });

    xmlContent += `  </cameras>\n`;
    xmlContent += `</evidencija_kamera>\n`;

    return this.downloadFile(xmlContent, 'kamera_evidencija.xml', 'application/xml;charset=utf-8;');
  }

  // Export u TSV (Tab Separated Values)
  static exportToTSV() {
    const cameras = storage.getAllCameras();
    
    const headers = [
      'ID', 'Naziv objekta', 'Ulica', 'Kvaliteta', 'Dana čuvanja',
      'Status', 'Datum provjere statusa', 'Vlasnik', 'Telefon', 'Email',
      'Broj kamera', 'Kategorija', 'Sigurnosni nivo', 'Napomene', 'Zadnja pregleda'
    ];

    const rows = cameras.map(cam => [
      cam.id,
      cam.objectName,
      cam.street,
      cam.quality,
      cam.retentionDays,
      cam.status,
      this.formatDate(cam.statusCheckDate || cam.installDate),
      cam.owner || '',
      cam.phone || '',
      cam.email || '',
      cam.cameraCount,
      cam.category || '',
      cam.securityLevel || '',
      cam.notes || '',
      this.formatDate(cam.lastMaintenance)
    ]);

    const tsv = headers.join('\t') + '\n' + rows.map(row => row.join('\t')).join('\n');
    
    return this.downloadFile(tsv, 'kamera_evidencija.tsv', 'text/tab-separated-values;charset=utf-8;');
  }

  // Helper - Preuzmite datoteku
  static downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Helper - Escape CSV znakove
  static escapeCSV(str) {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Helper - Escape XML znakove
  static escapeXML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Pripremi podatke za mobilnu aplikaciju
  static exportForMobileApp() {
    const cameras = storage.getAllCameras();
    const streets = storage.getAllStreets();
    const stats = storage.getStatistics();

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      summary: stats,
      cameras: cameras,
      streets: streets
    };
  }
}

// Primjer korištenja:
/*
// PDF
DataExporter.exportToPDF();

// Excel
DataExporter.exportToExcel();

// Print
const printContent = DataExporter.exportToPrint();
window.open().document.write(printContent);

// XML
DataExporter.exportToXML();

// TSV
DataExporter.exportToTSV();
*/
