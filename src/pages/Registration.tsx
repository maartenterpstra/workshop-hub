import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const Registration = () => {
  const hasExternalUrl = Boolean(siteConfig.externalRegistrationUrl);

  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Attendee Registration
          </h1>
          <p className="text-xl text-muted-foreground">
            {siteConfig.title} {siteConfig.subtitle} — {siteConfig.dates}
          </p>
        </div>

        <Alert className="mb-8 border-secondary/50 bg-secondary/5">
          <AlertCircle className="h-4 w-4 text-secondary" />
          <AlertDescription className="text-base">
            <strong className="text-foreground">Registration and payment are handled on an external platform</strong>{" "}
            operated by the Princess Máxima Center. This site is used only for abstract
            submission and peer review.
          </AlertDescription>
        </Alert>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              Register via the Princess Máxima Center
            </CardTitle>
            <CardDescription className="text-base">
              Opens {siteConfig.registrationOpensOn}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              All attendee registration, invoicing, and payment for {siteConfig.subtitle}{" "}
              takes place on the Princess Máxima Center registration platform. You will be
              redirected to their website to complete your registration.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Fees, cancellation policy, and receipts are managed by PMC.</li>
              <li>Abstract acceptance is independent from registration — you can register before or after submitting.</li>
              <li>
                The PMC registration site also publishes a curated list of nearby hotels with
                discounted rates negotiated for AIinRT2027 attendees — please consult it when
                booking your travel.
              </li>
              <li>For registration questions, contact the PMC events office via the external platform.</li>
            </ul>

            {hasExternalUrl ? (
              <Button asChild size="lg">
                <a
                  href={siteConfig.externalRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to PMC registration site
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            ) : (
              <div className="rounded-md border border-dashed p-4 text-sm italic">
                The link to the PMC registration site will appear here as soon as it goes live.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p>
              Interested in presenting your work? See the{" "}
              <a href="/submission" className="text-primary hover:underline">
                abstract submission
              </a>{" "}
              page for rules, format, and deadlines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
