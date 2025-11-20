import { Calendar, Users, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Deep Learning in Radiotherapy
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Workshop Series 2025
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-primary-foreground/90 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>March 17-18, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>UMC Utrecht, Netherlands</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/registration")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Register Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/program")}
                className="border-white text-white hover:bg-white/10"
              >
                View Program
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gradient-section">
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
                    <CardTitle>Educational Workshop</CardTitle>
                  </div>
                  <CardDescription className="text-base">Monday, March 17, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    A comprehensive 1-day educational workshop aimed at medical physicists in radiotherapy. 
                    Learn the principles of machine and deep learning, with applications in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Image synthesis</li>
                    <li>Auto contouring</li>
                    <li>Treatment planning</li>
                    <li>Image registration & contour propagation</li>
                    <li>Clinical implementation challenges</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    All presentations in English. NVKF accreditation arranged.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <CardTitle>Scientific Symposium</CardTitle>
                  </div>
                  <CardDescription className="text-base">Tuesday, March 18, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The third scientific symposium of the Radiotherapy Expert group initiative, 
                    featuring four strategic research themes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Image Synthesis and Reconstruction</li>
                    <li>Contouring & Registration</li>
                    <li>Radiomics</li>
                    <li>Clinical Implementation</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Open to researchers, clinical physicists, industry professionals, and policymakers.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20 shadow-card">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Registration Deadline</h3>
                    <p className="text-muted-foreground">
                      Register by <span className="font-semibold text-foreground">Sunday, March 2, 2025</span> to 
                      secure your spot at this premier educational event.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/registration")}
                    size="lg"
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Event Information
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:shadow-card transition-all cursor-pointer" onClick={() => navigate("/program")}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Program</CardTitle>
                  <CardDescription>View detailed schedules for both days</CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-card transition-all cursor-pointer" onClick={() => navigate("/registration")}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Registration</CardTitle>
                  <CardDescription>Secure your spot at the workshop</CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-card transition-all cursor-pointer" onClick={() => navigate("/venue")}>
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
