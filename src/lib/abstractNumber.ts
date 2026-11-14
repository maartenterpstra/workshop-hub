import { DEMO_ABSTRACT_ID } from "@/lib/demoAbstract";

/** Public, anonymous identifier for an abstract, e.g. AIinRT27-007. */
export const formatAbstractNumber = (n: number | null | undefined, id?: string): string => {
  if (id && id === DEMO_ABSTRACT_ID) return "EXAMPLE";
  if (n == null || !Number.isFinite(n) || n < 1) return "AIinRT27-???";
  return `AIinRT27-${String(Math.trunc(n)).padStart(3, "0")}`;
};

/** Version from a stored PDF path like ".../AIinRT27-003_2.pdf" (0 when none). */
export const pdfVersionFromPath = (path: string | null | undefined): number => {
  const m = path?.match(/_(\d+)\.pdf$/i);
  return m ? Number(m[1]) : 0;
};

export const versionedPdfName = (label: string, version: number): string => `${label}_${version}.pdf`;

/** File name part of a storage path. */
export const fileNameFromPath = (path: string): string => path.split("/").pop() ?? path;
