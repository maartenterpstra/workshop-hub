import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { formatAmsterdam } from "@/lib/formatDate";

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
  const { abstractId } = useParams<{ abstractId: string }>();
  const editing = Boolean(abstractId);
  const { submissionOpen, debug, opensAt, closesAt, loading: cfgLoading } = useAppConfig();

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
  const [figures, setFigures] = useState<File[]>([]);
  const [existingFilePath, setExistingFilePath] = useState<string | null>(null);
  const [existingFigurePaths, setExistingFigurePaths] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAbstract, setLoadingAbstract] = useState(editing);
  const [loadError, setLoadError] = useState<string | null>(null);

  const totalWords = countWords([background, methods, results, conclusion].join(" "));
  const overLimit = totalWords > WORD_LIMIT;

  useEffect(() => {
    supabase.from("topics").select("id, name").order("display_order").then(({ data }) => {
      setTopics((data ?? []) as Topic[]);
    });
  }, []);

  useEffect(() => {
    if (!editing || !abstractId || !user) return;
    (async () => {
      const [{ data: abstract, error: abstractError }, { data: authorRows, error: authorError }] =
        await Promise.all([
          supabase
            .from("abstracts")
            .select("id, title, topic_id, background, methods, results, conclusion, file_path, figure_paths, status")
            .eq("id", abstractId)
            .eq("submitted_by", user.id)
            .maybeSingle(),
          supabase
            .from("abstract_authors")
            .select("name, affiliation, email, is_presenting, author_order")
            .eq("abstract_id", abstractId)
            .order("author_order"),
        ]);

      if (abstractError || authorError || !abstract) {
        setLoadError("This abstract could not be found or you do not have access to it.");
        setLoadingAbstract(false);
        return;
      }
      if (abstract.status !== "submitted") {
        setLoadError("This abstract can no longer be edited because a decision has been recorded.");
        setLoadingAbstract(false);
        return;
      }

      setTitle(abstract.title);
      setTopicId(abstract.topic_id ?? "");
      setBackground(abstract.background ?? "");
      setMethods(abstract.methods ?? "");
      setResults(abstract.results ?? "");
      setConclusion(abstract.conclusion ?? "");
      setExistingFilePath(abstract.file_path);
      setExistingFigurePaths(abstract.figure_paths ?? []);
      if (authorRows?.length) {
        setAuthors(authorRows.map((author) => ({
          name: author.name,
          affiliation: author.affiliation ?? "",
          email: author.email ?? "",
          is_presenting: author.is_presenting,
        })));
      }
      setLoadingAbstract(false);
    })();
  }, [abstractId, editing, user]);

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

  const handleFigures = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const combined = [...figures, ...incoming].slice(0, 2);
    for (const f of incoming) {
      if (!["image/png", "image/jpeg"].includes(f.type)) {
        toast.error("Figures must be PNG or JPG.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error("Each figure must be under 10 MB.");
        return;
      }
    }
    if (figures.length + incoming.length > 2) {
      toast.warning("Maximum 2 display items — extra files ignored.");
    }
    setFigures(combined);
  };
  const removeFigure = (i: number) => setFigures((p) => p.filter((_, idx) => idx !== i));

  const updateAuthor = (i: number, patch: Partial<AuthorRow>) => {
    setAuthors((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  const addAuthor = () =>
    setAuthors((p) => [...p, { name: "", affiliation: "", email: "", is_presenting: false }]);
  const removeAuthor = (i: number) => setAuthors((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionOpen) {
      toast.error("The submission period is closed.");
      return;
    }
    if (!file && !existingFilePath) {
      toast.error("Please attach your abstract PDF.");
      return;
    }
    if (figures.length === 0 && existingFigurePaths.length === 0) {
      toast.error("Please attach at least one figure or table image.");
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
      const submissionId = abstractId ?? crypto.randomUUID();
      const filePath = `${user.id}/${submissionId}/abstract.pdf`;
      if (file) {
        const { error: upErr } = await supabase.storage.from("abstracts").upload(filePath, file, {
          contentType: "application/pdf",
          upsert: editing,
        });
        if (upErr) throw upErr;
      }

      let figurePaths = existingFigurePaths;
      if (figures.length > 0) {
        figurePaths = [];
        for (let i = 0; i < figures.length; i++) {
          const fig = figures[i];
          const ext = fig.type === "image/png" ? "png" : "jpg";
          const figPath = `${user.id}/${submissionId}/figure-${i + 1}.${ext}`;
          const { error: figErr } = await supabase.storage
            .from("abstracts")
            .upload(figPath, fig, { contentType: fig.type, upsert: editing });
          if (figErr) throw figErr;
          figurePaths.push(figPath);
        }
      }

      const wordCount = totalWords;

      const abstractPayload = {
          submitted_by: user.id,
          title: parsed.data.title,
          topic_id: parsed.data.topic_id,
          background: parsed.data.background,
          methods: parsed.data.methods,
          results: parsed.data.results,
          conclusion: parsed.data.conclusion,
          word_count: wordCount,
          file_path: existingFilePath ?? filePath,
          figure_paths: figurePaths,
          status: "submitted" as const,
        };
      const abstractMutation = editing && abstractId
        ? supabase.from("abstracts").update(abstractPayload).eq("id", abstractId).eq("submitted_by", user.id)
        : supabase.from("abstracts").insert(abstractPayload);
      const { data: abs, error: absErr } = await abstractMutation.select("id").single();
      if (absErr) throw absErr;

      const authorRows = parsed.data.authors.map((a, idx) => ({
        abstract_id: abs.id,
        name: a.name,
        affiliation: a.affiliation || null,
        email: a.email || null,
        is_presenting: a.is_presenting,
        author_order: idx + 1,
      }));
      if (editing) {
        const { error: deleteAuthorsError } = await supabase
          .from("abstract_authors")
          .delete()
          .eq("abstract_id", abs.id);
        if (deleteAuthorsError) throw deleteAuthorsError;
      }
      const { error: authErr } = await supabase.from("abstract_authors").insert(authorRows);
      if (authErr) throw authErr;

      toast.success(editing ? "Abstract changes saved." : "Abstract successfully submitted!");
      const { error: emailError } = await supabase.functions.invoke("send-confirmation-email", {
        body: { abstractId: abs.id, event: editing ? "updated" : "submitted" },
      });
      if (emailError) {
        console.error("Confirmation email failed:", emailError);
        toast.warning("Saved, but the confirmation email could not be sent.");
      }
      navigate("/my-abstracts");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cfgLoading || loadingAbstract) {
    return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;
  }

  if (loadError) {
    return (
      <div className="container max-w-2xl space-y-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Abstract unavailable</h1>
        <p className="text-muted-foreground">{loadError}</p>
        <Button onClick={() => navigate("/my-abstracts")}>Back to my abstracts</Button>
      </div>
    );
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
        <h1 className="text-3xl font-bold">{editing ? "Edit abstract" : "Submit an abstract"}</h1>
        <p className="text-muted-foreground mt-2">
          Signed in as {user?.email}. {debug && <span className="text-secondary">(debug mode)</span>}
        </p>
        {closesAt && (
          <p className="mt-2 text-sm font-medium">
            Submissions and revisions close {formatAmsterdam(closesAt)}.
          </p>
        )}

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
            <div className={`text-xs text-right font-medium ${overLimit ? "text-destructive" : "text-muted-foreground"}`}>
              {totalWords} / {WORD_LIMIT} words
              {overLimit && " — please shorten before submitting"}
            </div>
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
            <CardDescription>
              Compiled from the provided Word or LaTeX template. One A4 page, double-blind
              (no author names in the PDF). Max 20 MB.
            </CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Figures / tables *</CardTitle>
            <CardDescription>
              Upload 1–2 display items (figures and/or tables combined) as PNG or JPG,
              max 10 MB each. {editing && existingFigurePaths.length > 0
                ? "Your existing images remain unless you upload replacements."
                : "At least one image is required."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="file"
              id="fig-upload"
              accept="image/png,image/jpeg"
              multiple
              className="hidden"
              onChange={(e) => { handleFigures(e.target.files); e.target.value = ""; }}
            />
            <label
              htmlFor="fig-upload"
              className="cursor-pointer inline-flex items-center gap-2 border border-dashed rounded-md px-4 py-2 text-sm hover:border-primary hover:bg-primary/5"
            >
              <UploadCloud className="h-4 w-4" />
              {figures.length >= 2 ? "Maximum reached" : "Add figure/table"}
            </label>
            {figures.length > 0 && (
              <ul className="space-y-1 text-sm">
                {figures.map((f, i) => (
                  <li key={i} className="flex items-center justify-between border rounded-md px-3 py-2">
                    <span className="truncate">{f.name} <span className="text-xs text-muted-foreground">({(f.size / 1024 / 1024).toFixed(2)} MB)</span></span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFigure(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {editing && figures.length === 0 && existingFigurePaths.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {existingFigurePaths.length} existing image{existingFigurePaths.length === 1 ? "" : "s"} will be retained.
              </p>
            )}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={submitting || overLimit}>
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editing ? "Saving…" : "Submitting…"}</>
          ) : editing ? "Save changes" : "Submit abstract"}
        </Button>
      </form>
    </div>
  );
};

export default Submit;
