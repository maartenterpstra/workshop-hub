import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { stripPdfMetadata } from "@/lib/pdfAnonymize";
import { fileNameFromPath } from "@/lib/abstractNumber";

/** Opens a private abstract PDF in-page via the signed-in user's own access (no shareable link). */
const PdfViewerDialog = ({ path, title, number, onClose }: { path: string | null; title?: string; number?: string; onClose: () => void }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    setUrl(null); setError(null);
    supabase.storage.from("abstracts").download(path).then(async ({ data, error }) => {
      if (cancelled) return;
      if (error || !data) { setError("The PDF could not be loaded. Please refresh the page and try again, or contact the organizers."); return; }
      const clean = await stripPdfMetadata(await data.arrayBuffer(), number ?? "Abstract");
      if (cancelled) return;
      objectUrl = URL.createObjectURL(clean);
      setUrl(objectUrl);
    });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [path, number]);

  return (
    <Dialog open={!!path} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle className="pr-8">{number ? `${number} · ` : ""}{title ?? "Abstract PDF"}</DialogTitle></DialogHeader>
        {url && (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline"><a href={url} download={path ? fileNameFromPath(path) : `${number ?? "abstract"}.pdf`}><Download className="h-4 w-4" /> Download</a></Button>
          </div>
        )}
        <div className="flex-1 min-h-0 rounded-md border bg-muted">
          {error ? <p className="p-4 text-sm text-destructive">{error}</p>
            : url ? <iframe src={`${url}#toolbar=0&navpanes=0`} title={title ?? "Abstract PDF"} className="w-full h-full rounded-md" />
            : <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PdfViewerDialog;
