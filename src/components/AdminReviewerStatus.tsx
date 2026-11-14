import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Row = { reviewer_id: string; email: string; full_name: string | null; last_sign_in_at: string | null; must_change_password: boolean; assigned: number; reviewed: number };

const AdminReviewerStatus = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [preview, setPreview] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => supabase.rpc("admin_reviewer_status").then(({ data, error }) => {
    if (error) toast.error("Reviewer status could not be loaded.");
    setRows((data as Row[]) ?? []);
  });
  useEffect(() => { load(); }, []);

  const call = async (dryRun: boolean) => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("invite-reviewers", { body: { dryRun } });
    setBusy(false);
    if (error || data?.error) { toast.error(data?.error ?? "Request failed."); return; }
    if (dryRun) setPreview(data.count);
    else { toast.success(`Sent ${data.sent} invitation(s)${data.failed ? `, ${data.failed} failed` : ""}.`); setPreview(null); load(); }
  };

  const signedIn = rows.filter((r) => r.last_sign_in_at).length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviewer status</CardTitle>
        <CardDescription>{rows.length} reviewers · {signedIn} signed in · {rows.filter((r) => !r.must_change_password).length} password set</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {preview === null ? (
            <Button onClick={() => call(true)} disabled={busy}>
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}Send reviewer invitations
            </Button>
          ) : (
            <>
              <span className="text-sm">Invite {preview} reviewer(s) who haven't signed in yet (password link, deadline, guide)?</span>
              <Button onClick={() => call(false)} disabled={busy || preview === 0}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm and send</Button>
              <Button variant="outline" onClick={() => setPreview(null)} disabled={busy}>Cancel</Button>
            </>
          )}
        </div>
        <div className="max-h-96 overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr><th className="p-2">Reviewer</th><th className="p-2">Signed in</th><th className="p-2">Password set</th><th className="p-2">Assigned</th><th className="p-2">Reviews</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.reviewer_id} className="border-t">
                  <td className="p-2"><div className="font-medium">{r.full_name ?? "—"}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                  <td className="p-2">{r.last_sign_in_at ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}</td>
                  <td className="p-2">{r.must_change_password ? <Badge variant="outline">No</Badge> : <Badge>Yes</Badge>}</td>
                  <td className="p-2">{r.assigned}</td>
                  <td className="p-2">{r.reviewed}/{r.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
export default AdminReviewerStatus;
