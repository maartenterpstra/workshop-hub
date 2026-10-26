import { useCallback, useEffect, useState } from "react";
import { ImageOff, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const sign = async (path: string) => {
  const { data, error } = await supabase.storage.from("abstracts").createSignedUrl(path, 3600);
  if (error) console.error("Figure link failed", path, error.message);
  return data?.signedUrl ?? null;
};

/** One figure: private short-lived link, re-signed once on load error, then a visible retry state. */
const Figure = ({ path, index }: { path: string; index: number }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [retried, setRetried] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    const u = await sign(path);
    if (u) setUrl(u);
    else setFailed(true);
  }, [path]);

  useEffect(() => { load(); }, [load]);

  const onError = () => {
    if (!retried) { setRetried(true); load(); }
    else setFailed(true);
  };

  if (failed) {
    return (
      <div className="flex h-40 w-56 flex-col items-center justify-center gap-2 rounded-md border border-destructive/40 bg-muted p-2 text-center text-xs text-muted-foreground">
        Figure {index + 1} could not be loaded
        <Button type="button" size="sm" variant="outline" onClick={() => { setRetried(false); load(); }}>
          <RotateCw className="h-3 w-3" /> Retry
        </Button>
      </div>
    );
  }
  if (!url) {
    return <div className="flex h-40 w-56 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">Loading figure {index + 1}…</div>;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title={`Open figure ${index + 1}`}>
      <img src={url} alt={`Figure ${index + 1}`} onError={onError} className="h-40 max-w-xs rounded-md border bg-muted object-contain" />
    </a>
  );
};

const AbstractFigures = ({ paths }: { paths: string[] | null | undefined }) => {
  const list = paths ?? [];
  if (list.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImageOff className="h-4 w-4" /> No figure uploaded
      </div>
    );
  }
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">Figures / tables</div>
      <div className="flex flex-wrap gap-3">
        {list.map((p, i) => <Figure key={p} path={p} index={i} />)}
      </div>
    </div>
  );
};

export default AbstractFigures;
