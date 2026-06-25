import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Submit = () => {
  const { user, roles } = useAuth();
  return (
    <div className="container max-w-3xl py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit an abstract</h1>
        <p className="text-muted-foreground mt-2">
          Signed in as {user?.email}. Your roles: {roles.join(", ") || "author"}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submission form</CardTitle>
          <CardDescription>The abstract submission form will be available here once the call opens.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Coming soon — title, authors, topic, structured abstract, and file upload.
        </CardContent>
      </Card>
    </div>
  );
};

export default Submit;
