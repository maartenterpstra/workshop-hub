import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordResetRedirect } from "@/lib/authLinkError";

export default function ForgotPasswordForm({ initialEmail = "", onSent }: { initialEmail?: string; onSent?: (email: string) => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: passwordResetRedirect() });
    setLoading(false);
    if (error && /rate|429|seconds/i.test(error.message)) { setErr("Please wait a minute before requesting another email."); return; }
    setSent(true);
    onSent?.(email.trim());
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="fp-email">Email</Label>
        <Input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending…" : "Send me a new reset email"}</Button>
      {err && <p className="text-sm text-destructive">{err}</p>}
      {sent && (
        <p className="text-sm text-muted-foreground">
          If an account exists for this email, a reset email is on its way. Click the newest link straight away, or enter the code from the email on the{" "}
          <a href="/set-password" className="text-primary underline">Set password</a> page.
        </p>
      )}
    </form>
  );
}
