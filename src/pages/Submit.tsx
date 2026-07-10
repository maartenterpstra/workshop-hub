import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppConfig } from "@/hooks/useAppConfig";

interface Topic { id: string; name: string; }
interface AuthorRow { name: string; affiliation: string; email: string; is_presenting: boolean; }

const authorSchema = z.object({
  name: z.string().trim().min(1).max(200),
  affiliation: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  is_presenting: z.boolean(),
});

const WORD_LIMIT = 600;

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const formSchema = z.object({
  title: z.string().trim().min(5).max(300),
  topic_id: z.string().uuid(),
  background: z.string().trim().min(20).max(3000),
  methods: z.string().trim().min(20).max(3000),
  results: z.string().trim().min(20).max(3000),
  conclusion: z.string().trim().min(20).max(3000),
  authors: z.array(authorSchema).min(1).max(30),
}).refine(
  (d) => countWords([d.background, d.methods, d.results, d.conclusion].join(" ")) <= WORD_LIMIT,
  { message: `Abstract exceeds the ${WORD_LIMIT}-word limit.` }
);

const Submit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submissionOpen, debug, opensAt, loading: cfgLoading } = useAppConfig();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState("");
  const [background, setBackground] = useState("");
  const [methods, setMethods] = useState("");
  const [results, setResults] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [authors, setAuthors] = useState<AuthorRow[]>([
    { name: "", affiliation: "", email: user?.email ?? "", is_presenting: true },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("topics").select("id, name").order("display_order").then(({ data }) => {
      setTopics((data ?? []) as Topic[]);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20 MB.");
      return;
    }
    setFile(f);
  };

  const updateAuthor = (i: number, patch: Partial<AuthorRow>) => {
    setAuthors((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  const addAuthor = () =>
    setAuthors((p) => [...p, { name: "", affiliation: "", email: "", is_presenting: false }]);
  const removeAuthor = (i: number) => setAuthors((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please attach your abstract PDF.");
      return;
    }
    const parsed = formSchema.safeParse({
      title, topic_id: topicId, background, methods, results, conclusion, authors,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete all required fields.");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const filePath = `${user.id}/${crypto.randomUUID()}.pdf`;
      const { error: upErr } = await supabase.storage.from("abstracts").upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (upErr) throw upErr;

      const wordCount = [background, methods, results, conclusion].join(" ").split(/\s+/).filter(Boolean).length;

      const { data: abs, error: absErr } = await supabase
        .from("abstracts")
        .insert({
          submitted_by: user.id,
          title: parsed.data.title,
          topic_id: parsed.data.topic_id,
          background: parsed.data.background,
          methods: parsed.data.methods,
          results: parsed.data.results,
          conclusion: parsed.data.conclusion,
          word_count: wordCount,
          file_path: filePath,
          status: "submitted",
        })
        .select("id")
        .single();
      if (absErr) throw absErr;

      const authorRows = parsed.data.authors.map((a, idx) => ({
        abstract_id: abs.id,
        name: a.name,
        affiliation: a.affiliation || null,
        email: a.email || null,
        is_presenting: a.is_presenting,
        author_order: idx + 1,
      }));
      const { error: authErr } = await supabase.from("abstract_authors").insert(authorRows);
      if (authErr) throw authErr;

      toast.success("Abstract submitted. Reviewers assigned automatically.");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cfgLoading) {
    return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;
  }

  if (!submissionOpen) {
    return (
      <div className="container max-w-2xl py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Abstract submission is not open yet</h1>
        <p className="text-muted-foreground">
          {opensAt
            ? `Submissions open on ${opensAt.toLocaleString()}.`
            : "The organising committee will announce the opening date soon."}
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit an abstract</h1>
        <p className="text-muted-foreground mt-2">
          Signed in as {user?.email}. {debug && <span className="text-secondary">(debug mode)</span>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Abstract details</CardTitle>
            <CardDescription>Provide the title, topic and structured abstract.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} required />
            </div>
            <div className="space-y-2">
              <Label>Topic *</Label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger><SelectValue placeholder="Select topic…" /></SelectTrigger>
                <SelectContent>
                  {topics.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {[
              { label: "Background", value: background, setter: setBackground },
              { label: "Methods", value: methods, setter: setMethods },
              { label: "Results", value: results, setter: setResults },
              { label: "Conclusion", value: conclusion, setter: setConclusion },
            ].map(({ label, value, setter }) => (
              <div key={label} className="space-y-2">
                <Label>{label} *</Label>
                <Textarea value={value} onChange={(e) => setter(e.target.value)} rows={4} maxLength={3000} required />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authors</CardTitle>
            <CardDescription>List authors in order. Mark the presenting author.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authors.map((a, i) => (
              <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto_auto] items-end p-3 border rounded-md">
                <div className="space-y-1">
                  <Label className="text-xs">Name *</Label>
                  <Input value={a.name} onChange={(e) => updateAuthor(i, { name: e.target.value })} maxLength={200} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Affiliation</Label>
                  <Input value={a.affiliation} onChange={(e) => updateAuthor(i, { affiliation: e.target.value })} maxLength={200} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input type="email" value={a.email} onChange={(e) => updateAuthor(i, { email: e.target.value })} maxLength={255} />
                </div>
                <label className="text-xs flex items-center gap-1">
                  <input type="checkbox" checked={a.is_presenting} onChange={(e) => updateAuthor(i, { is_presenting: e.target.checked })} />
                  Presenting
                </label>
                {authors.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAuthor(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAuthor}>Add author</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abstract PDF *</CardTitle>
            <CardDescription>Drag &amp; drop or click to upload. PDF only, max 20 MB.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
            >
              <input
                type="file"
                id="pdf-upload"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {file ? <FileText className="h-8 w-8 text-primary" /> : <UploadCloud className="h-8 w-8 text-muted-foreground" />}
                <span className="text-sm font-medium">
                  {file ? file.name : "Drop PDF here or click to browse"}
                </span>
                {file && <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
              </label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : "Submit abstract"}
        </Button>
      </form>
    </div>
  );
};

export default Submit;
