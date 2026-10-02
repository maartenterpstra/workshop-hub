import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"busy" | "done" | "error">("busy");

  useEffect(() => {
    if (!token) return setState("error");
    supabase.functions
      .invoke("newsletter", { body: { action: "unsubscribe", token } })
      .then(({ data, error }) => setState(error || data?.error ? "error" : "done"));
  }, [token]);

  return (
    <div className="container max-w-lg py-20">
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <h1 className="text-2xl font-bold">Newsletter</h1>
          <p className="text-muted-foreground">
            {state === "busy" && "Unsubscribing…"}
            {state === "done" && "You have been unsubscribed. You won't receive further AIinRT newsletters."}
            {state === "error" && "This unsubscribe link is not valid or has expired."}
          </p>
          <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
