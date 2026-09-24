const escapeCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (headers: string[], rows: unknown[][]): string =>
  [headers, ...rows].map((r) => r.map(escapeCell).join(",")).join("\r\n");

export const downloadCsv = (filename: string, csv: string) => {
  // BOM so Excel reads UTF-8 accents correctly.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const todayStamp = () => new Date().toISOString().slice(0, 10);
