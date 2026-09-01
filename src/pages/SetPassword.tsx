import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_REVIEWER_PASSWORD } from "@/data/reviewerImport";

const SetPassword = () => {
  const navigate = useNavigate();
  const { user, mustChangePassword, refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password === DEFAULT_REVIEWER_PASSWORD) {
      toast.error("Please choose a password different from the default one.");
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
    navigate("/review", { replace: true });
  };

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>
            {mustChangePassword
              ? "Your account still uses the default password. Please choose a personal password to continue."
              : "Choose a new password for your account."}
          </CardDescription>
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
