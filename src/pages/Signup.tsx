import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, affiliation },
      },
    });

    if (error || !data.user) {
      setLoading(false);
      toast({ title: "Sign-up failed", description: error?.message ?? "Unknown error", variant: "destructive" });
      return;
    }

    const userId = data.user.id;

    // Create profile + assign default author role. RLS allows the user to insert their own rows.
    const [{ error: profileError }, { error: roleError }] = await Promise.all([
      supabase.from("profiles").insert({
        id: userId,
        email,
        full_name: fullName || null,
        affiliation: affiliation || null,
      }),
      supabase.from("user_roles").insert({ user_id: userId, role: "author" }),
    ]);

    setLoading(false);

    if (profileError || roleError) {
      toast({
        title: "Account created, profile setup failed",
        description: (profileError ?? roleError)?.message ?? "Please contact the organisers.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome!", description: "Your account is ready." });
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Required to submit an abstract to DLinRT 2027. Reviewer / SOC access is granted by the organising
            committee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliation">Affiliation</Label>
              <Input id="affiliation" required value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="text-xs text-muted-foreground">At least 8 characters. Common leaked passwords are blocked.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
