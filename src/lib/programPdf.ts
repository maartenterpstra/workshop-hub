import { jsPDF } from "jspdf";
import logoUrl from "@/assets/aiinrt2027-logo-horizontal.svg";
import { programDays, programNotice } from "@/data/program";
import { siteConfig } from "@/data/siteConfig";

type RGB = [number, number, number];

const hslToRgb = (h: number, s: number, l: number): RGB => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
};

const token = (name: string, fallback: RGB): RGB => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = v.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  return m ? hslToRgb(+m[1], +m[2], +m[3]) : fallback;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const rasterLogo = async () => {
  const img = await loadImage(logoUrl);
  const c = document.createElement("canvas");
  c.width = 1263; c.height = 360;
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
};

const circleAvatar = async (src: string) => {
  const img = await loadImage(src);
  const size = 240;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  const side = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - side) / 2, 0, side, side, 0, 0, size, size);
  return c.toDataURL("image/png");
};

export async function downloadProgramPdf() {
  const primary = token("--primary", [0, 61, 122]);
  const secondary = token("--secondary", [234, 109, 10]);
  const fg = token("--foreground", [18, 30, 43]);
  const muted = token("--muted-foreground", [87, 102, 117]);
  const border = token("--border", [215, 224, 232]);
  const mutedBg = token("--muted", [243, 246, 247]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 15;
  let y = M;

  try {
    doc.addImage(await rasterLogo(), "PNG", M, y, 63, 18);
  } catch { /* logo optional */ }
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...fg);
  doc.text("Programme", W - M, y + 8, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...muted);
  doc.text(`${siteConfig.dates} · ${siteConfig.location}`, W - M, y + 14, { align: "right" });
  y += 24;
  doc.setDrawColor(...secondary).setLineWidth(0.8).line(M, y, W - M, y);
  y += 5;

  // notice
  const noticeLines = doc.setFontSize(9.5).splitTextToSize(programNotice, W - 2 * M - 8);
  const nh = noticeLines.length * 4.5 + 5;
  doc.setFillColor(...mutedBg).setDrawColor(...primary).setLineWidth(0.3);
  doc.roundedRect(M, y, W - 2 * M, nh, 2, 2, "FD");
  doc.setFont("helvetica", "bold").setTextColor(...primary);
  doc.text(noticeLines, M + 4, y + 5.5);
  y += nh + 6;

  const avatars = new Map<string, string>();
  for (const d of programDays)
    for (const r of d.rows)
      if (r.kind === "session" && r.talk.avatarUrl)
        try { avatars.set(r.id, await circleAvatar(r.talk.avatarUrl)); } catch { /* initials */ }

  const ensure = (h: number) => {
    if (y + h > H - 18) { doc.addPage(); y = M; }
  };
  const timeW = 26, contentX = M + timeW, contentW = W - M - contentX;

  for (const [di, day] of programDays.entries()) {
    if (di > 0) { doc.addPage(); y = M; }
    ensure(20);
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...primary);
    doc.text(`${day.label} — ${day.date}`, M, y + 5);
    y += 9;
    day.rows.forEach((r, i) => {
      if (r.kind === "item") {
        ensure(8);
        if (i % 2 === 0) { doc.setFillColor(...mutedBg); doc.rect(M, y, W - 2 * M, 7, "F"); }
        doc.setFont("courier", "normal").setFontSize(8.5).setTextColor(...muted);
        doc.text(r.time, M + 2, y + 4.7);
        doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...fg);
        doc.text(r.label, contentX, y + 4.8);
        y += 7;
        return;
      }
      const textX = contentX + 20;
      const titleLines = doc.setFont("helvetica", "bold").setFontSize(9.5).splitTextToSize(r.talk.title, contentW - 24);
      const affLines = doc.setFont("helvetica", "normal").setFontSize(8.5).splitTextToSize(r.talk.affiliation, contentW - 24);
      const boxH = Math.max(18, 10 + titleLines.length * 4.2 + 4.5 + affLines.length * 3.8) + 15;
      ensure(boxH + 2);
      doc.setDrawColor(...border).setLineWidth(0.3).setFillColor(255, 255, 255);
      doc.roundedRect(M, y, W - 2 * M, boxH, 2, 2, "FD");
      doc.setFont("courier", "bold").setFontSize(8.5).setTextColor(...muted);
      doc.text(r.time, M + 2, y + 6);
      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...primary);
      doc.text(`${r.id}  ${r.title}`, contentX, y + 6);
      const by = y + 10, bh = boxH - 14;
      doc.setFillColor(235, 241, 248); doc.rect(contentX, by, contentW - 2, bh, "F");
      doc.setFillColor(...primary); doc.rect(contentX, by, 0.8, bh, "F");
      const ax = contentX + 3, ay = by + 2.5, ad = 14;
      const av = avatars.get(r.id);
      if (av) doc.addImage(av, "PNG", ax, ay, ad, ad);
      else {
        doc.setFillColor(220, 229, 240); doc.circle(ax + ad / 2, ay + ad / 2, ad / 2, "F");
        doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...primary);
        doc.text(r.talk.initials, ax + ad / 2, ay + ad / 2 + 1.5, { align: "center" });
      }
      let ty = by + 5;
      doc.setFillColor(...primary); doc.roundedRect(textX, ty - 3.2, 21, 4.4, 0.8, 0.8, "F");
      doc.setFont("helvetica", "bold").setFontSize(6.5).setTextColor(255, 255, 255);
      doc.text("EXPERT TALK", textX + 10.5, ty, { align: "center" });
      ty += 5;
      doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(...primary);
      doc.text(titleLines, textX, ty); ty += titleLines.length * 4.2;
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...fg);
      doc.text(r.talk.speaker, textX, ty); ty += 3.8;
      doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...muted);
      doc.text(affLines, textX, ty);
      doc.setFont("helvetica", "italic").setFontSize(8.5).setTextColor(...muted);
      doc.text("+ 5 proffered papers (to be announced)", contentX, y + boxH - 1.5);
      y += boxH + 2;
    });
    y += 6;
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...border).setLineWidth(0.3).line(M, H - 12, W - M, H - 12);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...muted);
    doc.text("AIinRT2027 · aiinrt.org", M, H - 7);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 7, { align: "right" });
  }
  doc.save("AIinRT2027-programme.pdf");
}
