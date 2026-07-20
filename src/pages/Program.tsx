import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Archive, AlertCircle, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";

const sessions = [
  { id: "S1", title: "Segmentation & Registration" },
  { id: "S2", title: "Reconstruction & Synthesis" },
  { id: "S3", title: "Foundation Models, Text, Explainability & Uncertainty" },
  { id: "S4", title: "Dose & Adaptive Workflows" },
  { id: "S5", title: "Clinical Predictions & Outcomes" },
  { id: "S6", title: "Implementation, QA & Ethics" },
];

const day1: Array<[string, string]> = [
  ["08:30–09:15", "Registration & welcome coffee"],
  ["09:15–09:30", "Opening remarks"],
  ["09:30–11:00", "Session 1: Segmentation & Registration"],
  ["11:00–11:30", "Coffee break"],
  ["11:30–13:00", "Session 2: Reconstruction & Synthesis"],
  ["13:00–14:15", "Lunch"],
  ["14:15–15:45", "Session 3: Foundation Models, Text, Explainability & Uncertainty"],
  ["16:00–16:45", "Keynote 1"],
  ["16:45-17:30", "Refreshments"],
  [">19:00", "Optional: social dinner"],
];

const day2: Array<[string, string]> = [
  ["08:30–09:15", "Morning coffee / re-registration"],
  ["09:15–10:45", "Session 4: Dose & Adaptive Workflows"],
  ["10:45–11:15", "Coffee break"],
  ["11:15–12:45", "Session 5: Clinical Predictions & Outcomes"],
  ["12:45–14:00", "Lunch"],
  ["14:00–15:30", "Session 6: Implementation, QA & Ethics"],
  ["15:45–16:30", "Keynote 2"],
  ["16:30–17:00", "Awards & closing"],
  ["17:00–18:30", "Farewell borrel"],
];

const DayTable = ({ label, rows }: { label: string; rows: Array<[string, string]> }) => (
  <div>
    <h3 className="font-semibold text-foreground mb-3">{label}</h3>
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([time, item], i) => (
            <tr
              key={time + i}
              className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}
            >
              <td className="px-3 py-2 font-mono text-xs whitespace-nowrap align-top text-muted-foreground w-32">
                {time}
              </td>
              <td className="px-3 py-2 text-foreground">{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Program = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 px-4">
      <div className="container max-w-5xl">
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
            <strong className="text-foreground">Program TBC.</strong> The final programme
            will be built from peer-reviewed abstracts. Call for Abstracts opens{" "}
            {siteConfig.callForAbstractsOpens}.
          </AlertDescription>
        </Alert>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Format
            </CardTitle>
            <CardDescription className="text-base">
              A two-day scientific symposium organised along the clinical workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Six 90-minute sessions in clinical-workflow order. Each session opens with a{" "}
              <strong className="text-foreground">30-minute invited state-of-the-art talk</strong>{" "}
              (low self-reference), followed by{" "}
              <strong className="text-foreground">five proffered papers</strong> (9 min + 3 min
              discussion). One <strong className="text-foreground">cross-disciplinary keynote</strong>{" "}
              closes each day.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 bg-muted/20"
                >
                  <span className="font-mono text-sm font-semibold text-primary shrink-0">
                    {s.id}
                  </span>
                  <span className="text-foreground">{s.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              Provisional timetable
            </CardTitle>
            <CardDescription>Subject to change.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <DayTable label="Day 1" rows={day1} />
            <DayTable label="Day 2" rows={day2} />
          </CardContent>
        </Card>

        <div className="mb-8">
          <Button onClick={() => navigate("/submission")}>See Call for Abstracts</Button>
        </div>

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
