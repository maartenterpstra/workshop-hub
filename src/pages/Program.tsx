import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, Users } from "lucide-react";

const Program = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Program</h1>
          <p className="text-xl text-muted-foreground">
            Detailed schedules for the educational workshop and scientific symposium
          </p>
        </div>

        <Tabs defaultValue="educational" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="educational" className="text-base">
              <BookOpen className="h-4 w-4 mr-2" />
              Educational Workshop
            </TabsTrigger>
            <TabsTrigger value="scientific" className="text-base">
              <Users className="h-4 w-4 mr-2" />
              Scientific Symposium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="educational" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  Educational Workshop - Deep Learning in Radiotherapy
                </CardTitle>
                <CardDescription className="text-base">
                  Monday, March 17, 2025 | Department of Radiotherapy, UMC Utrecht
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="text-base mb-4">
                      This 1-day educational workshop introduces medical physicists to the principles 
                      and applications of deep learning in radiotherapy. The program covers both 
                      theoretical foundations and practical implementations.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">Key Topics</h3>
                    <ul className="space-y-2 text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Introduction to machine learning and deep learning principles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Image synthesis and reconstruction techniques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Automated contouring and segmentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Deep learning in treatment planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Image registration and contour propagation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Clinical implementation challenges and solutions</span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Language:</strong> All presentations will be in English<br />
                        <strong>Accreditation:</strong> NVKF accreditation will be arranged<br />
                        <strong>Target Audience:</strong> Medical physicists in radiotherapy (open to all interested professionals)
                      </p>
                    </div>

                    <p className="text-sm italic mt-4">
                      The detailed schedule with specific times and speakers will be finalized by the beginning of March.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scientific" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader className="bg-secondary/5 border-b">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  Scientific Symposium - Deep Learning in Radiotherapy
                </CardTitle>
                <CardDescription className="text-base">
                  Tuesday, March 18, 2025 | Department of Radiotherapy, UMC Utrecht
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="text-base mb-4">
                      The third scientific symposium of the Radiotherapy Expert group initiative. 
                      This platform promotes scientific exchange and clinical use of deep learning 
                      in radiotherapy across The Netherlands.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-4">Expert Groups & Themes</h3>
                  </div>

                  <div className="grid gap-4">
                    <Card className="bg-card border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Image Synthesis and Reconstruction</CardTitle>
                        <CardDescription>Lead: Matteo Maspero, UMC Utrecht</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Advanced techniques for generating and reconstructing medical images using deep learning.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Contouring & Registration</CardTitle>
                        <CardDescription>Lead: To be assigned, NKI</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Automated organ and tumor delineation, image registration, and contour propagation.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Radiomics</CardTitle>
                        <CardDescription>Lead: Marianna Sijtsema, UMCG</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Extraction and analysis of quantitative features from medical images for outcome prediction.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Clinical Implementation</CardTitle>
                        <CardDescription>Lead: Charlotte Brouwer, UMCG</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Practical challenges and solutions for integrating deep learning into clinical workflows.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Language:</strong> All presentations will be in English<br />
                      <strong>Endorsement:</strong> Under revision for endorsement by the Dutch Association of Clinical Physics (NVKF)<br />
                      <strong>Audience:</strong> Open to researchers, clinical physicists, industry professionals, and policymakers
                    </p>
                  </div>

                  <p className="text-sm italic text-muted-foreground">
                    The detailed schedule with presentation times will be finalized by early March.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Program;
