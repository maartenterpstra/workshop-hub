import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePenLine, FilePlus2, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppConfig } from "@/hooks/useAppConfig";

interface AbstractSummary {
  id: string;
  title: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  topic: { name: string } | null;
}

const formatAmsterdam = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
    timeZoneName: "short",
  }).format(date);

const MyAbstracts = () => {
  const { user } = useAuth();
  const { submissionOpen, closesAt, loading: configLoading } = useAppConfig();
  const [abstracts, setAbstracts] = useState<AbstractSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("abstracts")
      .select("id, title, status, submitted_at, updated_at, topic:topics(name)")
      .eq("submitted_by", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setAbstracts((data ?? []) as AbstractSummary[]);
        setLoading(false);
      });
  }, [user]);

  if (loading || configLoading) {
    return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="container max-w-4xl space-y-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My abstracts</h1>
          <p className="mt-2 text-muted-foreground">
            {closesAt
              ? `Submissions and revisions close ${formatAmsterdam(closesAt)}.`
              : "The submission deadline will be announced soon."}
          </p>
        </div>
        {submissionOpen && (
          <Button asChild>
            <Link to="/submit"><FilePlus2 />New abstract</Link>
          </Button>
        )}
      </div>

      {!submissionOpen && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground">
          <LockKeyhole className="h-4 w-4" />
          The submission period is closed. Your abstracts are now read-only.
        </div>
      )}

      {abstracts.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            You have not submitted an abstract yet.
          </CardContent>
        </Card>
      )}

      {abstracts.map((abstract) => (
        <Card key={abstract.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-secondary">{abstract.topic?.name ?? "No topic"}</p>
                <CardTitle className="mt-1">{abstract.title}</CardTitle>
              </div>
              <Badge variant="outline">{abstract.status.replaceAll("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Last saved {formatAmsterdam(new Date(abstract.updated_at))}
            </p>
            {submissionOpen && abstract.status === "submitted" && (
              <Button asChild variant="outline" size="sm">
                <Link to={`/submit/${abstract.id}`}><FilePenLine />Edit abstract</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyAbstracts;