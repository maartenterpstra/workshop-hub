import { Calendar, MapPin, FileText, Archive, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";
import { aboutContent } from "@/data/aboutContent";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/80 mb-3">
              Pre-announcement
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              {siteConfig.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              {siteConfig.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-primary-foreground/90 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{siteConfig.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{siteConfig.location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/registration")}
                className="bg-white text-primary hover:bg-white/80"
              >
                <FileText className="h-4 w-4" />
                Call for Abstracts
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent text-primary-foreground border-primary-foreground/60 hover:bg-white/10 hover:text-primary-foreground"
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

      {/* Call for Abstracts highlight */}
      <section className="py-12 px-4 bg-gradient-section">
        <div className="container max-w-4xl">
          <Card className="bg-primary/5 border-primary/20 shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground">
                    Call for Abstracts
                  </h2>
                  <p className="text-muted-foreground">
                    The scientific programme will be built from peer-reviewed abstracts.
                    Submission opens{" "}
                    <span className="font-semibold text-foreground">
                      {siteConfig.callForAbstractsOpens}
                    </span>
                    . Authors, reviewers, and the scientific organising committee will use
                    this site throughout the submission and review process.
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Registration for attendees will be handled on a separate site —
                    details to follow.
                  </p>
                </div>
                <Button size="lg" onClick={() => navigate("/registration")}>
                  Learn more
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              About the Workshop
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{aboutContent.educational.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {aboutContent.educational.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {aboutContent.educational.description}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {aboutContent.educational.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    {aboutContent.educational.note}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <CardTitle>{aboutContent.scientific.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {aboutContent.scientific.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {aboutContent.scientific.description}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {aboutContent.scientific.themes.map((theme, index) => (
                      <li key={index}>{theme}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    {aboutContent.scientific.note}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16 px-4 bg-gradient-section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Event Information
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="group hover:shadow-card transition-all cursor-pointer"
                onClick={() => navigate("/program")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Program</CardTitle>
                  <CardDescription>To be built from accepted abstracts</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-card transition-all cursor-pointer"
                onClick={() => navigate("/registration")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Submission & Registration</CardTitle>
                  <CardDescription>Abstracts here, registration externally</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-card transition-all cursor-pointer"
                onClick={() => navigate("/venue")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <MapPin className="h-6 w-6 text-secondary" />
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
