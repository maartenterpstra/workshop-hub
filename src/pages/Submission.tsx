import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";

const topics = [
  "Segmentation & Registration",
  "Reconstruction & Synthesis",
  "Foundation Models & Text",
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
            Deadline: {siteConfig.abstractSubmissionDeadline}. Decisions follow peer review.
          </AlertDescription>
        </Alert>

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
                Abstracts must be submitted in structured form with the following sections:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li><strong className="text-foreground">Background</strong> — clinical/technical motivation</li>
                <li><strong className="text-foreground">Methods</strong> — data, model, experimental setup</li>
                <li><strong className="text-foreground">Results</strong> — quantitative outcomes</li>
                <li><strong className="text-foreground">Conclusion</strong> — take-home message and outlook</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Length & file format</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Maximum <strong className="text-foreground">500 words</strong> across all sections (excluding title, authors, references).</li>
                <li>Up to <strong className="text-foreground">1 figure or table</strong>.</li>
                <li>Upload a single <strong className="text-foreground">PDF</strong> (max 5 MB). No Word or LaTeX source.</li>
                <li>Use A4, 11pt, single column, 2 cm margins.</li>
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
                <li>List all authors with affiliation and email.</li>
                <li>Mark the <strong className="text-foreground">presenting author</strong>.</li>
                <li>Author names must not appear inside the PDF — reviews are single-blind.</li>
              </ul>
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
              <h3 className="font-semibold text-foreground mb-2">Ethics & originality</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Work must be original and not previously published in full.</li>
                <li>Studies involving patient data must state ethical approval and data governance.</li>
                <li>Disclose funding and conflicts of interest.</li>
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
              Questions?{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
                {siteConfig.contact.email}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submission;
