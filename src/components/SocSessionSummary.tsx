import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { sessionCounts } from "@/lib/sessionCounts";

export default function SocSessionSummary({ abstracts }: { abstracts: { topic: string | null; status: string }[] }) {
  const [topics, setTopics] = useState<string[]>([]);
  useEffect(() => {
    supabase.from("topics").select("name").order("display_order").then(({ data }) => setTopics((data ?? []).map((t) => t.name)));
  }, []);
  const { rows, total } = useMemo(() => sessionCounts(topics, abstracts), [topics, abstracts]);
  return (
    <Card>
      <CardHeader><CardTitle>Abstracts per session</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead className="text-right">Active</TableHead>
              <TableHead className="text-right">Withdrawn</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.session}>
                <TableCell>{r.session}</TableCell>
                <TableCell className="text-right">{r.active}</TableCell>
                <TableCell className="text-right">{r.withdrawn}</TableCell>
                <TableCell className="text-right">{r.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{total.active}</TableCell>
              <TableCell className="text-right">{total.withdrawn}</TableCell>
              <TableCell className="text-right">{total.total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
