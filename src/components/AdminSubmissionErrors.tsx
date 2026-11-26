import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAmsterdam } from "@/lib/formatDate";

interface Row { id: string; user_id: string; step: string; message: string | null; file_size: number | null; file_type: string | null; created_at: string; }

const AdminSubmissionErrors = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("submission_errors").select("*").order("created_at", { ascending: false }).limit(50);
      const r = (data ?? []) as Row[];
      setRows(r);
      const ids = [...new Set(r.map((x) => x.user_id))];
      if (ids.length) {
        const { data: p } = await supabase.from("profiles").select("id, email").in("id", ids);
        setEmails(Object.fromEntries((p ?? []).map((x) => [x.id, x.email ?? ""])));
      }
    })();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Failed submission attempts</CardTitle>
        <CardDescription>Last 50 failed submit/save attempts, with the step that failed. Use this to help authors who report problems.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">No failed attempts logged.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Author</TableHead><TableHead>Step</TableHead><TableHead>File</TableHead><TableHead>Error</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{formatAmsterdam(r.created_at)}</TableCell>
                  <TableCell>{emails[r.user_id] ?? r.user_id.slice(0, 8)}</TableCell>
                  <TableCell>{r.step}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.file_type ?? "—"}{r.file_size ? ` · ${(r.file_size / 1024 / 1024).toFixed(1)} MB` : ""}</TableCell>
                  <TableCell className="max-w-xs break-words text-xs">{r.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
export default AdminSubmissionErrors;
