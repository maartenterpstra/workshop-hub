import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Archive, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";

const Program = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Program</h1>
          <p className="text-xl text-muted-foreground mb-2">{siteConfig.dates}</p>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            {siteConfig.location}
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-base">
            <strong className="text-foreground">Program TBC.</strong> The {siteConfig.subtitle}{" "}
            programme will be built from peer-reviewed abstracts. Call for Abstracts opens{" "}
            {siteConfig.callForAbstractsOpens}.
          </AlertDescription>
        </Alert>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              What to expect
            </CardTitle>
            <CardDescription className="text-base">
              Two days, in collaboration with Princess Máxima Center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              The 2027 edition will follow the established two-day format: an educational
              workshop introducing deep learning in radiotherapy, and a scientific symposium
              with peer-reviewed oral and poster contributions across the strategic themes
              of the Radiotherapy Expert group initiative.
            </p>
            <p>
              Detailed sessions, speakers, and timings will appear here once abstracts have
              been reviewed and accepted.
            </p>
            <div className="pt-4">
              <Button onClick={() => navigate("/registration")}>
                See Call for Abstracts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-foreground flex items-center gap-2">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  Previous edition (2026)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full 2026 programme, speakers, and venue details are archived.
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href={siteConfig.previousEditionUrl}>View 2026 archive</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Program;
