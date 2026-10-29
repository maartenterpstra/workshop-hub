import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Archive, AlertCircle, Clock, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";
import { programDays, programNotice, type ExpertTalk, type Keynote, type ProgramDay } from "@/data/program";
import { toast } from "sonner";
import { usePublicSchedule, type PublicSlot } from "@/hooks/usePublicSchedule";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const KeynoteRow = ({ time, label, k }: { time: string; label: string; k: Keynote }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="w-full text-left px-3 py-3 bg-secondary/5 hover:bg-secondary/10 transition-colors">
        <div className="flex gap-3 text-sm">
          <span className="font-mono text-xs font-semibold text-muted-foreground w-24 shrink-0 pt-0.5">{time}</span>
          <p className="font-semibold text-secondary">{label}</p>
        </div>
        <div className="mt-3 flex items-center gap-3 border-l-2 border-secondary p-3">
          <img src={k.avatarUrl} alt={k.speaker} loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover object-top" />
          <div className="min-w-0">
            <span className="inline-block rounded-sm bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">Keynote</span>
            <p className="mt-1.5 text-sm font-semibold text-foreground">{k.speaker}</p>
            <p className="text-xs text-muted-foreground">{k.affiliation}</p>
            <p className="mt-1 text-sm text-foreground">{k.title}</p>
            <p className="mt-0.5 text-xs font-medium text-secondary">View bio & abstract</p>
          </div>
        </div>
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-4">
          <img src={k.avatarUrl} alt={k.speaker} className="h-20 w-20 rounded-full object-cover object-top" />
          <div>
            <DialogTitle>{k.speaker}</DialogTitle>
            <DialogDescription>{label} · {time}{k.affiliation ? ` · ${k.affiliation}` : ""}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-foreground mb-1">{k.title}</h4>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Biography</h4>
          <p className="text-muted-foreground">{k.bio || "Coming soon."}</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-1">Abstract</h4>
          <p className="text-muted-foreground">{k.abstract || "Coming soon."}</p>
        </div>
        {k.profileUrl && (
          <a href={k.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-medium text-primary underline underline-offset-2">
            {k.profileLabel ?? "Profile"} ↗
          </a>
        )}
      </div>
    </DialogContent>
  </Dialog>
);


const TalkAvatar = ({ t }: { t: ExpertTalk }) => (
  <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-base font-bold text-primary overflow-hidden">
    {t.avatarUrl ? (
      <img src={t.avatarUrl} alt={t.speaker} loading="lazy" className="h-16 w-16 rounded-full object-cover object-top" />
    ) : (
      t.initials
    )}
  </div>
);

const DaySchedule = ({ day, slots }: { day: ProgramDay; slots: PublicSlot[] }) => (
  <div>
    <h3 className="font-semibold text-foreground mb-3">
      {day.label} <span className="text-muted-foreground font-normal">— {day.date}</span>
    </h3>
    <div className="overflow-hidden rounded-lg border border-border divide-y divide-border">
      {day.rows.map((r, i) =>
        r.kind === "item" ? (
          <div key={r.time + i} className={`flex gap-3 px-3 py-2 text-sm ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>
            <span className="font-mono text-xs text-muted-foreground w-24 shrink-0 pt-0.5">{r.time}</span>
            <div className="min-w-0">
              <span className="text-foreground">{r.label}</span>
              {r.location && <span className="text-foreground"> — {r.location}</span>}
              {r.mapsUrl && (
                <a
                  href={r.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <MapPin className="h-3 w-3" />
                  Google Maps directions
                </a>
              )}
            </div>
          </div>
        ) : r.kind === "keynote" ? (
          <KeynoteRow key={r.label} time={r.time} label={r.label} k={r.keynote} />
        ) : (
          <div key={r.id} className="px-3 py-3 bg-background">
            <div className="flex gap-3 text-sm">
              <span className="font-mono text-xs font-semibold text-muted-foreground w-24 shrink-0 pt-0.5">{r.time}</span>
              <p className="font-semibold text-primary">
                <span className="font-mono mr-2">{r.id}</span>
                {r.title}
              </p>
            </div>
            <div className="mt-3 flex gap-3 border-l-2 border-primary bg-primary/5 p-3">
              <TalkAvatar t={r.talk} />
              <div className="min-w-0">
                <span className="inline-block rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  Expert talk
                </span>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-primary">{r.talk.title}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{r.talk.speaker}</p>
                <p className="text-xs text-muted-foreground">{r.talk.affiliation}</p>
              </div>
            </div>
            {slots.some((x) => x.session_id === r.id && x.kind === "oral") ? (
              <ul className="mt-2 divide-y divide-border">
                {slots.filter((x) => x.session_id === r.id && x.kind === "oral").map((x) => (
                  <li key={x.title} className="flex gap-3 py-1.5 text-sm">
                    <span className="font-mono text-xs text-muted-foreground w-24 shrink-0 pt-0.5">{x.start_time}–{x.end_time}</span>
                    <span className="min-w-0">
                      <span className="text-foreground">{x.title}</span>
                      {x.presenter && <span className="block text-xs text-muted-foreground">{x.presenter}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs italic text-muted-foreground">+ 5 proffered papers (to be announced)</p>
            )}
          </div>
        ),
      )}
    </div>
  </div>
);

const Program = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const slots = usePublicSchedule();
  const published = slots.length > 0;
  const posters = slots.filter((x) => x.kind === "poster");

  const handlePdf = async () => {
    setBusy(true);
    try {
      const { downloadProgramPdf } = await import("@/lib/programPdf");
      await downloadProgramPdf();
    } catch (e) {
      console.error(e);
      toast.error("Could not create the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="container max-w-6xl">
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
            {published ? "Final programme, including the accepted talks and posters." : programNotice}{" "}
            <span className="block mt-1 text-sm">
              Presented work can be developed into a full paper for the{" "}
              <a href={siteConfig.specialIssueUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                phiRO virtual special issue on AI in radiotherapy
              </a>.
            </span>
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
              A two-day scientific symposium organised along the clinical workflow. Endorsed by ESTRO.
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                Programme
              </CardTitle>
              <CardDescription>{published ? "Final programme." : "Provisional — subject to change."}</CardDescription>
            </div>
            <Button onClick={handlePdf} disabled={busy} variant="outline">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download programme (PDF)
            </Button>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-2 gap-6">
            {programDays.map((d) => (
              <DaySchedule key={d.label} day={d} slots={slots} />
            ))}
          </CardContent>
        </Card>

        {posters.length > 0 && (
          <Card className="shadow-card border-0 mb-8">
            <CardHeader><CardTitle>Posters</CardTitle></CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {posters.map((x) => (
                  <li key={x.title} className="py-2 text-sm">
                    <span className="font-mono text-xs text-primary mr-2">{x.session_id}</span>
                    <span className="text-foreground">{x.title}</span>
                    {x.authors && <span className="block text-xs text-muted-foreground">{x.authors}</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

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
