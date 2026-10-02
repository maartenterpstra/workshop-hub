import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSignup = ({ compact = false }: { compact?: boolean }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!consent) return setError("Please tick the consent box.");
    setState("busy");
    const { data, error } = await supabase.functions.invoke("newsletter", {
      body: { action: "subscribe", email, name, consent: true, website },
    });
    if (error || data?.error) {
      setState("idle");
      setError(data?.error ?? "Could not subscribe. Please check your email and try again.");
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="flex items-start gap-2 text-sm text-foreground">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
        <span>Thanks! You're subscribed. Check your inbox for a welcome email.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className={compact ? "space-y-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Input type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
        <Input placeholder="Name (optional)" aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} aria-hidden="true" />
        <Button type="submit" disabled={state === "busy"} className={compact ? "w-full" : ""}>
          {state === "busy" ? <Loader2 className="animate-spin" /> : <Mail />}Subscribe
        </Button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        I agree to receive AIinRT news by email. I can unsubscribe at any time.
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
};

export default NewsletterSignup;
