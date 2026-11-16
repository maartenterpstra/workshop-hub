import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatAbstractNumber } from "@/lib/abstractNumber";

type Row = { assignment_id: string; abstract_id: string; abstract_number: number | null; title: string; reviewer_email: string; reviewer_name: string | null; decline_reason: string | null; active_reviewers: number };

const AdminDeclinedReviews = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const load = () => supabase.rpc("admin_declined_reviews").then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);
  const reassign = async (id: string) => {
    setBusy(id);
    const { error } = await supabase.rpc("reassign_review", { _assignment_id: id });
    setBusy(null);
    if (error) toast.error(error.message); else { toast.success("Assigned to another reviewer."); load(); }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Declined reviews</CardTitle>
        <CardDescription>Reviewers who declined an abstract (e.g. conflict of interest). Reassign picks a topic-matched reviewer with the lowest load.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">No declined reviews.</p> : (
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr><th className="p-2">Abstract</th><th className="p-2">Declined by</th><th className="p-2">Reason</th><th className="p-2">Active reviewers</th><th className="p-2" /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.assignment_id} className="border-t">
                  <td className="p-2"><span className="font-mono text-xs">{formatAbstractNumber(r.abstract_number, r.abstract_id)}</span> {r.title}</td>
                  <td className="p-2">{r.reviewer_name ?? "—"}<div className="text-xs text-muted-foreground">{r.reviewer_email}</div></td>
                  <td className="p-2">{r.decline_reason ?? "—"}</td>
                  <td className="p-2">{r.active_reviewers < 5 ? <Badge variant="destructive">{r.active_reviewers} (&lt; 5)</Badge> : r.active_reviewers}</td>
                  <td className="p-2"><Button size="sm" onClick={() => reassign(r.assignment_id)} disabled={busy === r.assignment_id}>Reassign</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
export default AdminDeclinedReviews;
