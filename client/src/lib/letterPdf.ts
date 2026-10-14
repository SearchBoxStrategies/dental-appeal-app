// Appeal letters on the practice's letterhead: a PDF download and a print view.

export interface Letterhead {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  website?: string | null;
  npi_number?: string | null;
  logo_url?: string | null;
}

const cityLine = (p: Letterhead) =>
  [p.city, [p.state, p.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');

export function letterheadLines(p: Letterhead): string[] {
  const contact = [p.phone && `Tel ${p.phone}`, p.fax && `Fax ${p.fax}`].filter(Boolean).join('   ');
  const web = [p.email, p.website].filter(Boolean).join('   ');
  return [p.address || '', cityLine(p), contact, web].filter(Boolean);
}

// Letter text with the letterhead on top, for the .txt download and clipboard.
export function letterWithLetterhead(p: Letterhead, letter: string): string {
  return [p.name || '', ...letterheadLines(p), '', letter].join('\n');
}

export async function downloadLetterPdf(p: Letterhead, letter: string, fileName: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 64;
  const width = pageWidth - margin * 2;
  let y = 56;

  if (p.logo_url && p.logo_url.startsWith('data:image/')) {
    try {
      const format = p.logo_url.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(p.logo_url, format, margin, y - 6, 48, 48);
    } catch {
      // A broken logo should never block the letter.
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text(p.name || 'Dental Practice', pageWidth / 2, y + 8, { align: 'center' });
  y += 24;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  for (const line of letterheadLines(p)) {
    doc.text(line, pageWidth / 2, y, { align: 'center' });
    y += 12;
  }
  y += 4;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 26;

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  const lineHeight = 15;
  for (const paragraph of letter.replace(/\r\n/g, '\n').split('\n')) {
    const lines: string[] = paragraph.trim() === '' ? [''] : doc.splitTextToSize(paragraph, width);
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  const pages = doc.getNumberOfPages();
  if (pages > 1) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pages}`, pageWidth / 2, pageHeight - 28, { align: 'center' });
    }
  }

  doc.save(fileName);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function printLetter(p: Letterhead, letter: string, title: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  const logo = p.logo_url && p.logo_url.startsWith('data:image/')
    ? `<img src="${escapeHtml(p.logo_url)}" style="height:48px;float:left" alt="">` : '';
  win.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title>
    <style>
      @page { margin: 0.8in; }
      body { font-family: 'Times New Roman', serif; color: #111827; font-size: 11pt; line-height: 1.45; }
      .head { text-align: center; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 24px; }
      .name { font-family: Arial, sans-serif; font-weight: bold; font-size: 16pt; color: #1e3a8a; }
      .info { font-family: Arial, sans-serif; font-size: 8.5pt; color: #475569; }
      pre { white-space: pre-wrap; font-family: inherit; margin: 0; }
    </style></head><body>
    <div class="head">${logo}<div class="name">${escapeHtml(p.name || 'Dental Practice')}</div>
    ${letterheadLines(p).map((l) => `<div class="info">${escapeHtml(l)}</div>`).join('')}</div>
    <pre>${escapeHtml(letter)}</pre>
    </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
