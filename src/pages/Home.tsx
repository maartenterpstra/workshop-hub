import { Calendar, MapPin, FileText, Archive, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";
import PartnerLogos from "@/components/PartnerLogos";
import utrechtHero from "@/assets/utrecht-hero.jpg";

const Home = () => {
  const navigate = useNavigate();
  const timelineItems = [
    { label: "Call for abstracts", date: "1 September 2026" },
    { label: "Registration opening", date: "1 October 2026" },
    { label: "Abstract submission deadline", date: "1 December 2026" },
    { label: "Abstract decisions communicated", date: "17 December 2026" },
    { label: "Registration closes", date: "1 March 2027" },
    { label: "AIinRT2027 Symposium", date: "1–2 April 2027" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={utrechtHero}
            alt="The Dom Tower rising above the historic canals of Utrecht at golden hour"
            className="h-full w-full object-cover"
            width={1920}
            height={1088}
          />
          {/* Blue → orange dual-brand overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/60 to-secondary/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>

        <div className="container relative py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 mb-3 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-xs uppercase tracking-[0.2em] text-white font-medium">
                Utrecht · Pre-announcement
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-[1.05] tracking-tight">
              Artificial Intelligence
              <br />
              <span className="bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent">
                in Radiotherapy
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              AIinRT2027 — a scientific symposium in the heart of Utrecht,
              organized by <strong className="font-semibold">UMC Utrecht</strong>{" "}
              (<a href="https://www.cig-utrecht.org" target="_blank" rel="noopener noreferrer" className="underline decoration-white/40 hover:decoration-white">Computational Imaging Group</a>){" "}
              in collaboration with the{" "}
              <strong className="font-semibold">Princess Máxima Center</strong>{" "}
              for pediatric oncology and{" "}
              <strong className="font-semibold">DLinRT.eu</strong>.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/95 mb-10">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-200" />
                <span className="font-medium">{siteConfig.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-200" />
                <span className="font-medium">{siteConfig.location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/submission")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-warm font-semibold"
              >
                <FileText className="h-4 w-4" />
                Call for Abstracts
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/10 backdrop-blur-sm text-white border-white/40 hover:bg-white/20 hover:text-white"
              >
                <a href={siteConfig.previousEditionUrl}>
                  <Archive className="h-4 w-4" />
                  Previous edition (2026)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner logos section */}
      <section className="bg-white/95 backdrop-blur-md border-t border-border py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold text-center md:text-left">
              Organized by UMC Utrecht<br className="hidden md:block" /> in collaboration with PMC & DLinRT.eu
            </span>
            <PartnerLogos />
          </div>
        </div>
      </section>

      {/* Call for Abstracts highlight */}
      <section className="py-16 px-4 bg-gradient-section">
        <div className="container max-w-5xl">
          <Card className="border-0 shadow-card overflow-hidden bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
              <CardContent className="pt-8 pb-8 md:pl-10">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-bold mb-3">
                  <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  Opens {siteConfig.callForAbstractsOpens}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                  Call for Abstracts
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                  The scientific programme is built entirely from 
                  peer-reviewed abstract submissions evaluated through a double-blind review process. 
                  Authors, reviewers, and the scientific organising committee use this site throughout
                  the submission and review process.
{/*                  The scientific programme will be built entirely from
                  double-blinded, peer-reviewed abstract submissions. Authors, reviewers, and
                  the scientific organising committee use this site throughout
                  the submission and review process.
*/}                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Attendee registration will be handled on a separate site — details to follow.
                </p>
              </CardContent>
              <div className="flex items-center justify-center bg-gradient-warm p-6 md:p-10">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/submission")}
                  className="bg-white text-secondary hover:bg-white/90 font-semibold shadow-lg w-full md:w-auto"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">
                About
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Two days. One community.
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                A two-day scientific symposium showcasing the state of the art in artificial intelligence for radiotherapy.
              </p>
            </div>

            <Card className="shadow-soft border-0 overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">
                    When it happens
                  </div>
                 <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Timeline
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Important dates for the symposium
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {timelineItems.map((item, index) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-background/70 p-4 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-10 w-34 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {item.date}
                      </div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      {/* <p className="text-sm text-muted-foreground mt-1">{item.date}</p> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8 shadow-soft border-0 overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col gap-6">
                  <div className="max-w-2xl">
                    <div className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">
                      What to expect
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      A two-day symposium with talks, discussion and networking
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The final agenda is still being shaped, but visitors can expect a programme
                      built around scientific sessions, keynote talks, and plenty of time for
                      conversation and exchange.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[
                      {
                        text: "Six sessions covering segmentation & registration, reconstruction & synthesis, foundation models, dose & adaptive workflows, clinical predictions and implementation",
                        className: "border-primary/20 bg-primary/5 text-foreground",
                      },
                      {
                        text: "Keynote talks connecting AI advances to radiotherapy practice",
                        className: "border-secondary/20 bg-secondary/5 text-foreground",
                      },
                      {
                        text: "Dedicated breaks, lunch and networking moments throughout both days",
                        className: "border-slate-300 bg-slate-50 text-foreground",
                      },
                      {
                        text: "A social programme that may include an informal dinner",
                        className: "border-primary/20 bg-background/80 text-foreground",
                      },
                    ].map((item) => (
                      <div key={item.text} className={`rounded-2xl border p-4 text-sm font-medium shadow-sm ${item.className}`}>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Utrecht */}
      <section className="py-20 px-4 bg-gradient-section">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">
                The Venue
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet us in Utrecht
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                A compact, walkable Dutch city with a 900-year-old cathedral
                tower at its centre, canals lined with cafés, and a 25-minute
                train ride from Schiphol Airport. UMC Utrecht and the Princess
                Máxima Center sit side-by-side on the Utrecht Science Park.
              </p>
              <Button variant="outline" size="lg" onClick={() => navigate("/venue")}>
                <MapPin className="h-4 w-4" />
                Venue & travel
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-primary text-primary-foreground p-6 shadow-card">
                <div className="text-4xl font-black">25′</div>
                <div className="text-sm text-primary-foreground/80 mt-1">
                  from Schiphol by train
                </div>
              </div>
              <div className="rounded-xl bg-secondary text-secondary-foreground p-6 shadow-warm mt-8">
                <div className="text-4xl font-black">2</div>
                <div className="text-sm text-secondary-foreground/90 mt-1">
                  world-class hosts
                </div>
              </div>
              <div className="rounded-xl bg-white border p-6 shadow-soft">
                <div className="text-4xl font-black text-primary">1254</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Dom Tower construction begins
                </div>
              </div>
              <div className="rounded-xl bg-white border p-6 shadow-soft mt-8">
                <div className="text-4xl font-black text-secondary">6</div>
                <div className="text-sm text-muted-foreground mt-1">
                  scientific themes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Event information
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="group hover:shadow-card transition-all cursor-pointer border-0 shadow-soft"
                onClick={() => navigate("/program")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Calendar className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle>Program</CardTitle>
                  <CardDescription>State of the art scientific presentations</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-card transition-all cursor-pointer border-0 shadow-soft"
                onClick={() => navigate("/registration")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary transition-colors">
                    <FileText className="h-6 w-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
                  </div>
                  <CardTitle>Submission & Registration</CardTitle>
                  <CardDescription>Abstracts here, registration externally</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-card transition-all cursor-pointer border-0 shadow-soft"
                onClick={() => navigate("/venue")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <MapPin className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle>Venue</CardTitle>
                  <CardDescription>Location and travel information</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
