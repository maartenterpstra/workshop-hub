import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/siteConfig";

const Registration = () => {
  const hasExternalUrl = Boolean(siteConfig.externalRegistrationUrl);

  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Submission & Registration
          </h1>
          <p className="text-xl text-muted-foreground">
            How to take part in {siteConfig.title} {siteConfig.subtitle}
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-base">
            <strong className="text-foreground">Pre-announcement.</strong> Detailed dates and
            links will be added here as they are confirmed.
          </AlertDescription>
        </Alert>

        {/* Abstracts */}
        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Call for Abstracts
            </CardTitle>
            <CardDescription className="text-base">
              Opens {siteConfig.callForAbstractsOpens}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Abstract submission and peer review for {siteConfig.subtitle} will take place
              on this site. Authors will be able to create an account, submit an abstract,
              and track its review status. The scientific programme will be assembled from
              accepted abstracts.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong className="text-foreground">Submission opens:</strong>{" "}
                {siteConfig.callForAbstractsOpens}
              </li>
              <li>
                <strong className="text-foreground">Submission deadline:</strong>{" "}
                {siteConfig.abstractSubmissionDeadline}
              </li>
              <li>
                <strong className="text-foreground">Decisions:</strong> following peer review
              </li>
            </ul>
            <p className="text-sm">
              The submission form will appear here once the call opens. For questions,
              contact{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
                {siteConfig.contact.email}
              </a>{" "}
              or{" "}
              <a href={`mailto:${siteConfig.contact.email2}`} className="text-primary hover:underline">
                {siteConfig.contact.email2}
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* External registration */}
        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              Attendee Registration
            </CardTitle>
            <CardDescription className="text-base">
              Opens {siteConfig.registrationOpensOn}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Registration for attendees of {siteConfig.subtitle} will be handled on a
              separate dedicated registration site. The link will be added here as soon as
              it is live.
            </p>
            {hasExternalUrl ? (
              <Button asChild size="lg">
                <a
                  href={siteConfig.externalRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to registration site
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <p className="text-sm italic">Registration link to be announced.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">Target audience:</strong> Clinicians
              involved in radiotherapy, medical physicists, researchers, computer scientists
              working on medical imaging or AI, and industry representatives developing or
              integrating deep learning in radiotherapy.
            </p>
            <p>
              <strong className="text-foreground">Looking for the 2026 edition?</strong>{" "}
              See the{" "}
              <a href={siteConfig.previousEditionUrl} className="text-primary hover:underline">
                2026 archive
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
