import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

type A = { name: string; affiliation: string; email: string; is_presenting: boolean };

const EditAuthorsDialog = ({ abstractId, title }: { abstractId: string; title: string }) => {
  const [open, setOpen] = useState(false);
  const [authors, setAuthors] = useState<A[]>([]);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    const { data, error } = await supabase.from("abstract_authors")
      .select("name, affiliation, email, is_presenting, author_order").eq("abstract_id", abstractId).order("author_order");
    if (error) { toast.error("Authors could not be loaded."); return; }
    setAuthors((data ?? []).map((a) => ({ name: a.name, affiliation: a.affiliation ?? "", email: a.email ?? "", is_presenting: a.is_presenting })));
    setOpen(true);
  };
  const upd = (i: number, p: Partial<A>) => setAuthors((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: number) => setAuthors((xs) => {
    const ys = [...xs]; const j = i + d; if (j < 0 || j >= ys.length) return xs;
    [ys[i], ys[j]] = [ys[j], ys[i]]; return ys;
  });

  const save = async () => {
    if (authors.some((a) => !a.name.trim())) { toast.error("Each author needs a name."); return; }
    if (authors.filter((a) => a.is_presenting).length !== 1) { toast.error("Choose exactly one presenting author."); return; }
    setBusy(true);
    const { error } = await supabase.rpc("replace_abstract_authors", { _abstract_id: abstractId, _authors: authors as any });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Authors updated.");
    setOpen(false);
    supabase.functions.invoke("send-confirmation-email", { body: { abstractId, event: "updated" } })
      .then(({ data }) => { if (data?.skipped) toast.info("No new confirmation email was sent, because one went out in the last 24 hours."); })
      .catch(() => {});
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={start}><Users />Edit authors</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit authors</DialogTitle>
            <DialogDescription>{title} — only the author list changes. Reviewers never see authors.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {authors.map((a, i) => (
              <div key={i} className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
                <div className="space-y-1"><Label>Name</Label><Input value={a.name} maxLength={200} onChange={(e) => upd(i, { name: e.target.value })} /></div>
                <div className="space-y-1"><Label>Affiliation</Label><Input value={a.affiliation} maxLength={300} onChange={(e) => upd(i, { affiliation: e.target.value })} /></div>
                <div className="space-y-1"><Label>Email</Label><Input type="email" value={a.email} maxLength={254} onChange={(e) => upd(i, { email: e.target.value })} /></div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="presenting" checked={a.is_presenting}
                      onChange={() => setAuthors((xs) => xs.map((x, j) => ({ ...x, is_presenting: j === i })))} />Presenting
                  </label>
                  <div className="ml-auto flex gap-1">
                    <Button type="button" size="icon" variant="ghost" aria-label="Move up" onClick={() => move(i, -1)}><ArrowUp /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label="Move down" onClick={() => move(i, 1)}><ArrowDown /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label="Remove author" disabled={authors.length === 1}
                      onClick={() => setAuthors((xs) => xs.filter((_, j) => j !== i))}><Trash2 /></Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" disabled={authors.length >= 30}
              onClick={() => setAuthors((xs) => [...xs, { name: "", affiliation: "", email: "", is_presenting: false }])}><Plus />Add author</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save authors"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default EditAuthorsDialog;
