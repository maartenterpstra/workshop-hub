import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

const SetPassword = () => {
  const navigate = useNavigate();
  const { user, mustChangePassword, refreshProfile, hasRole } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "recovery" });
    setVerifying(false);
    if (error) { toast.error("That code is invalid or expired. Request a new email from the sign-in page."); return; }
    toast.success("Code accepted — now choose your password.");
  };

  if (!user) {
    return (
      <div className="container max-w-md py-16">
        <Card>
          <CardHeader>
            <CardTitle>Set your password</CardTitle>
            <CardDescription>
              Enter your email and the code from your password-reset email. No email yet, or the link expired? Request a new one below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={verifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sp-email">Email</Label>
                <Input id="sp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-code">Code from the email</Label>
                <Input id="sp-code" inputMode="numeric" required value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={verifying}>{verifying ? "Checking…" : "Continue"}</Button>
            </form>
            <div className="mt-6 rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Need a new email?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the email address your invitation was sent to.</li>
                <li>Click the newest email only — older links stop working.</li>
                <li>Work email may open links automatically; if the link fails, request a new one below.</li>
              </ul>
            </div>
            <div className="mt-4"><ForgotPasswordForm initialEmail={email} /></div>
            <p className="mt-4 text-xs text-muted-foreground">
              Still stuck? Email <a className="text-primary underline" href="mailto:m.maspero@umcutrecht.nl">m.maspero@umcutrecht.nl</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords don't match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }
    if (user) {
      await supabase.from("profiles").update({ must_change_password: false }).eq("id", user.id);
    }
    await refreshProfile();
    setSaving(false);
    toast.success("Password updated.");
    navigate(hasRole("reviewer") || hasRole("soc") || hasRole("admin") ? "/review" : "/my-abstracts", { replace: true });
  };

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>
            {mustChangePassword
              ? "Please choose a personal password to continue."
              : "Choose a new password for your account."}
          </CardDescription>
          <p className="text-sm">Setting the password for <strong>{user.email}</strong></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pw">New password</Label>
              <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw2">Repeat password</Label>
              <Input id="pw2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;
