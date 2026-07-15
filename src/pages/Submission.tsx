import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, CheckCircle2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";
import docxTemplate from "@/assets/abstract-template-docx.asset.json";
import texTemplate from "@/assets/abstract-template-tex.asset.json";

const topics = [
  "Segmentation & Registration",
  "Reconstruction & Synthesis",
  "Foundation Models, Text, Explainability & Uncertainty",
  "Dose & Adaptive Workflows",
  "Clinical Predictions & Outcomes",
  "Implementation, QA & Ethics",
];

const Submission = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Abstract Submission
          </h1>
          <p className="text-xl text-muted-foreground">
            Call for abstracts — {siteConfig.title} {siteConfig.subtitle}
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-base">
            <strong className="text-foreground">Submission opens {siteConfig.callForAbstractsOpens}.</strong>{" "}
            Deadline: {siteConfig.abstractSubmissionDeadline}. Decisions follow peer review.{" "}
            <span className="block mt-2 text-foreground/90">
              Work that has been submitted to (or is under review at) another venue is welcome,
              provided it has <strong>not yet been presented</strong>. Please disclose it on
              submission — this does not affect scoring.
            </span>
          </AlertDescription>
        </Alert>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-primary" />
              </div>
              Download the abstract template
            </CardTitle>
            <CardDescription className="text-base">
              Use either the Word or LaTeX template — they define the required layout
              (one A4 page, ~500 words, up to 2 display items, double-blind).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={docxTemplate.url} download>
                <Download className="mr-2 h-4 w-4" />
                Word template (.docx)
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={texTemplate.url} download>
                <Download className="mr-2 h-4 w-4" />
                LaTeX template (.tex)
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Submission rules & format
            </CardTitle>
            <CardDescription className="text-base">
              Please read carefully before submitting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-2">Structured abstract</h3>
              <p>
                Prepare your abstract in the template, then on the submission platform paste
                the text of each section into a separate field:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li><strong className="text-foreground">Introduction / Purpose</strong> — clinical or technical problem and aim</li>
                <li><strong className="text-foreground">Materials & Methods</strong> — data, model, experimental setup</li>
                <li><strong className="text-foreground">Results</strong> — quantitative outcomes</li>
                <li><strong className="text-foreground">Conclusion</strong> — take-home message and outlook</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">What you will provide on the form</h3>
              <p className="text-sm mb-2">
                The form asks for three things separately — please have them ready:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  <strong className="text-foreground">Abstract text</strong> copied from your template into the structured fields
                  (Introduction / Methods / Results / Conclusion).
                </li>
                <li>
                  <strong className="text-foreground">Figures and/or tables</strong> uploaded separately as image files
                  (PNG or JPG) — up to <strong className="text-foreground">2 display items</strong> in total, one file each.
                </li>
                <li>
                  <strong className="text-foreground">Final compiled PDF</strong> of the full abstract (built from the
                  template) uploaded as a single file.
                </li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Length & format constraints</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Target <strong className="text-foreground">500 words</strong> across the four sections
                  (excluding title, authors, captions, references). The submission form accepts up to{" "}
                  <strong className="text-foreground">600 words</strong> as a small margin.
                </li>
                <li>Up to <strong className="text-foreground">2 display items</strong> (figures and/or tables combined).</li>
                <li>Compiled PDF: A4, single page, using the provided template. No Word or LaTeX source is required.</li>
                <li>
                  <strong className="text-foreground">Double-blind:</strong> no author names, affiliations or
                  acknowledgements anywhere in the PDF. Author details are entered in the form only.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Topics</h3>
              <p>Choose exactly one topic that best matches your work:</p>
              <ul className="grid sm:grid-cols-2 gap-1 mt-2 text-sm list-disc list-inside">
                {topics.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Authors</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>List all authors with affiliation and email on the form.</li>
                <li>Mark the <strong className="text-foreground">presenting author</strong>.</li>
                <li><strong className="text-foreground">Author names must not appear inside the PDF.</strong></li>
              </ul>
            </section>

            <section className="rounded-lg border border-secondary/40 bg-secondary/5 p-4">
              <h3 className="font-semibold text-foreground mb-1">Best-paper award — free APC waiver</h3>
              <p className="text-sm">
                The highest-scoring abstract (based on reviewer scores) will receive a
                <strong className="text-foreground"> full Article Processing Charge (APC) waiver </strong>
                toward a follow-up open-access publication.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Review criteria</h3>
              <p>Each abstract is scored (1–5) by up to five reviewers on:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>Technical soundness</li>
                <li>Relevance to radiotherapy</li>
                <li>Novelty</li>
                <li>Reproducibility (data + code statement)</li>
                <li>Fit to session</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Originality & disclosure</h3>
              <p className="text-sm mb-2">
                Our goal is a high-quality, science-focused meeting with a low threshold to
                participate. We <strong className="text-foreground">encourage submissions of work
                that is already submitted or under review elsewhere</strong>, as long as it has
                not yet been presented at another conference.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Please disclose any prior or concurrent submission on the form — this <strong className="text-foreground">will not impact scoring</strong>.</li>
                <li>Studies involving patient data must state ethical approval and data governance.</li>
                <li>Disclose funding and conflicts of interest.</li>
                <li>AI-use disclosure is mandatory ("None" is acceptable).</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              Ready to submit?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Sign in with your account to access the submission form. New authors can create
              an account in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/submit">Go to submission form</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/signup">Create an account</Link>
              </Button>
            </div>
            <p className="text-sm">
              Questions? See the Contact section in the footer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submission;
