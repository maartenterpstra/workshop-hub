import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Users } from "lucide-react";
import { reviewers } from "@/data/reviewers";

const Reviewers = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Reviewers</h1>
          <p className="text-xl text-muted-foreground">
            Peer reviewers for the AIinRT 2027 abstract track
          </p>
        </div>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              {reviewers.length} confirmed reviewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {reviewers.map((r) => (
                <li key={`${r.name}-${r.surname}`} className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <span className="font-semibold text-foreground">
                      {r.name} {r.surname}
                    </span>
                    <span className="text-muted-foreground"> — {r.affiliation}</span>
                  </div>
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
                    >
                      Bio <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-6">
              Only reviewers who consented to be listed publicly are shown. Additional reviewers
              may join the panel; the full list is finalized before the review period opens.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reviewers;
