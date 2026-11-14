import { PDFDocument, PDFName } from "pdf-lib";

/** Removes hidden document info (author, creator, title, XMP) that often contains author names. */
export const stripPdfMetadata = async (bytes: ArrayBuffer, label: string): Promise<Blob> => {
  try {
    const doc = await PDFDocument.load(bytes, { updateMetadata: false, ignoreEncryption: true });
    doc.setTitle(label); doc.setAuthor(""); doc.setSubject(""); doc.setKeywords([]);
    doc.setCreator(""); doc.setProducer("");
    doc.catalog.delete(PDFName.of("Metadata"));
    const out = await doc.save();
    return new Blob([out as BlobPart], { type: "application/pdf" });
  } catch {
    return new Blob([bytes], { type: "application/pdf" });
  }
};
