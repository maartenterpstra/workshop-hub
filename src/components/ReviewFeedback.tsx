import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { feedback_value: string | null; feedback_improve: string | null; feedback_tips: string | null };

/** Anonymous reviewer feedback for the author's own abstract, once the decision email has gone out. */
const ReviewFeedback = ({ abstractId }: { abstractId: string }) => {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.rpc("get_my_review_feedback", { _abstract_id: abstractId }).then(({ data }) => setRows((data as Row[]) ?? []));
  }, [abstractId]);
  if (!rows.length) return null;
  return (
    <div className="mt-3 space-y-2">
      <div className="font-semibold text-foreground">Reviewer feedback</div>
      {rows.map((r, i) => (
        <div key={i} className="rounded border bg-background p-2 text-muted-foreground space-y-1">
          <div className="text-xs font-medium text-foreground">Reviewer {i + 1}</div>
          <p><span className="font-medium">Where is the value?</span> {r.feedback_value}</p>
          <p><span className="font-medium">What could be done better?</span> {r.feedback_improve}</p>
          <p><span className="font-medium">Tips:</span> {r.feedback_tips}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewFeedback;
