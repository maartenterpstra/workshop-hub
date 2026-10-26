import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Shows an abstract's figure/table images via short-lived private links. */
const AbstractFigures = ({ paths }: { paths: string[] | null | undefined }) => {
  const [urls, setUrls] = useState<(string | null)[]>([]);
  const list = paths ?? [];
  const key = list.join("|");

  useEffect(() => {
    let active = true;
    Promise.all(
      list.map(async (p) => {
        const { data } = await supabase.storage.from("abstracts").createSignedUrl(p, 600);
        return data?.signedUrl ?? null;
      }),
    ).then((u) => active && setUrls(u));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
        {list.map((p, i) =>
          urls[i] ? (
            <a key={p} href={urls[i]!} target="_blank" rel="noopener noreferrer" title={`Open figure ${i + 1}`}>
              <img src={urls[i]!} alt={`Figure ${i + 1}`} className="h-40 max-w-xs rounded-md border bg-muted object-contain" />
            </a>
          ) : (
            <div key={p} className="flex h-40 w-56 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
              Figure {i + 1} unavailable
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default AbstractFigures;
