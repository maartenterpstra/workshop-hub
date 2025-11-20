import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, BookOpen, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const Program = () => {
  const [openBio, setOpenBio] = useState<string | null>(null);

  const speakers = {
    "mitko-veta": {
      name: "Mitko Veta",
      affiliation: "TU Eindhoven",
      initials: "MV",
      bio: "Mitko Veta is an expert in medical image analysis and deep learning at TU Eindhoven, specializing in computational pathology and machine learning applications in healthcare."
    },
    "matteo-maspero": {
      name: "Matteo Maspero",
      affiliation: "UMC Utrecht",
      initials: "MM",
      bio: "Matteo Maspero is a medical physicist at UMC Utrecht, leading the Image Synthesis and Reconstruction expert group. His research focuses on deep learning applications in radiotherapy, particularly in image synthesis and autocontouring."
    },
    "samuele-papa": {
      name: "Samuele Papa",
      affiliation: "NKI Amsterdam",
      initials: "SP",
      bio: "Samuele Papa is a researcher at the Netherlands Cancer Institute (NKI) in Amsterdam, specializing in deep learning methods for medical image reconstruction."
    },
    "maarten-terpstra": {
      name: "Maarten Terpstra",
      affiliation: "UMC Utrecht",
      initials: "MT",
      bio: "Maarten Terpstra is a medical physicist at UMC Utrecht, focusing on image registration and contour propagation using deep learning techniques in radiotherapy."
    },
    "adrian-thummerer": {
      name: "Adrian Thummerer",
      affiliation: "LMU Munich",
      initials: "AT",
      bio: "Adrian Thummerer is a researcher at Ludwig Maximilian University (LMU) Munich, specializing in deep learning for medical image synthesis."
    },
    "sebastiaan-breedveld": {
      name: "Sebastiaan Breedveld",
      affiliation: "Erasmus MC Rotterdam",
      initials: "SB",
      bio: "Sebastiaan Breedveld is a medical physicist at Erasmus MC Rotterdam, focusing on automated treatment planning and optimization algorithms in radiotherapy."
    },
    "victor-strijbis": {
      name: "Victor Strijbis",
      affiliation: "University Hospital Bern",
      initials: "VS",
      bio: "Victor Strijbis is a researcher at the University Hospital Bern, specializing in explainable AI and uncertainty quantification in medical imaging applications."
    },
    "nico-van-den-berg": {
      name: "Nico van den Berg",
      affiliation: "UMC Utrecht",
      initials: "NB",
      bio: "Nico van den Berg is a medical physicist at UMC Utrecht, working on the application of large language models and natural language processing in radiotherapy."
    },
    "pim-borman": {
      name: "Pim Borman",
      affiliation: "UMC Utrecht",
      initials: "PB",
      bio: "Pim Borman is a clinical computer scientist at UMC Utrecht, specializing in regulatory issues and clinical implementation of deep learning solutions in radiotherapy."
    }
  };

  const SpeakerName = ({ speakerId }: { speakerId: string }) => {
    const speaker = speakers[speakerId as keyof typeof speakers];
    const isOpen = openBio === speakerId;

    return (
      <div className="inline-block">
        <button
          onClick={() => setOpenBio(isOpen ? null : speakerId)}
          className="inline-flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1 -mx-2 transition-colors group"
        >
          <Avatar className="h-6 w-6 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {speaker.initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold">{speaker.name}</span>
          <span className="text-muted-foreground">({speaker.affiliation})</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
        {isOpen && (
          <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/50 text-sm text-muted-foreground">
            {speaker.bio}
          </div>
        )}
      </div>
    );
  };

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
                  Monday, March 17, 2025 | Auditorium, Q-building, Department of Radiotherapy, UMC Utrecht
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Opening */}
                    <div className="flex gap-4 pb-4 border-b border-border/50">
                      <div className="flex-shrink-0 w-32 font-semibold text-primary">
                        9:20 - 9:30
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-1">Opening remarks</div>
                        <div className="text-sm text-muted-foreground">
                          <SpeakerName speakerId="matteo-maspero" />
                        </div>
                      </div>
                    </div>

                    {/* Morning Session 1 */}
                    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                        9:30 - 11:00 | Lectures
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          9:30 - 10:30
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Introduction to deep learning</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="mitko-veta" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          10:30 - 11:00
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Deep learning for autocontouring</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="matteo-maspero" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Break */}
                    <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                      <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                        11:00 - 11:20
                      </div>
                      <div className="flex-1 font-semibold text-foreground">
                        Break
                      </div>
                    </div>

                    {/* Morning Session 2 */}
                    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                        11:20 - 12:30 | Lectures
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          11:20 - 11:55
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Deep learning methods for image reconstruction</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="samuele-papa" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          11:55 - 12:30
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Deep learning methods for image registration and contour propagation</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="maarten-terpstra" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                      <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                        12:30 - 13:30
                      </div>
                      <div className="flex-1 font-semibold text-foreground">
                        Lunch
                      </div>
                    </div>

                    {/* Afternoon Session 1 */}
                    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                        13:30 - 15:35 | Lectures
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          13:30 - 14:15
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Deep learning for image synthesis</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="adrian-thummerer" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          14:15 - 14:55
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Deep learning for treatment planning</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="sebastiaan-breedveld" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          14:55 - 15:35
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Explainable AI & Uncertainty</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="victor-strijbis" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Break */}
                    <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                      <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                        15:35 - 15:50
                      </div>
                      <div className="flex-1 font-semibold text-foreground">
                        Break
                      </div>
                    </div>

                    {/* Afternoon Session 2 */}
                    <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                        15:50 - 17:00 | Lectures
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          15:50 - 16:30
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Large language models in radiotherapy</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="nico-van-den-berg" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                          16:30 - 17:00
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-semibold text-foreground">Regulatory issues & Implementation of deep learning in the clinic</div>
                          <div className="text-sm">
                            <SpeakerName speakerId="pim-borman" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Closing */}
                    <div className="flex gap-4 py-3 bg-primary/10 rounded-lg px-4">
                      <div className="flex-shrink-0 w-32 font-semibold text-primary">
                        17:00
                      </div>
                      <div className="flex-1 font-semibold text-foreground">
                        Drinks
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                    <p>
                      <strong>Language:</strong> All presentations will be in English<br />
                      <strong>Accreditation:</strong> NVKF accreditation will be arranged<br />
                      <strong>Target Audience:</strong> Medical physicists in radiotherapy (open to all interested professionals)
                    </p>
                  </div>

                  <p className="text-sm italic text-muted-foreground">
                    Click on speaker avatars to view their bio
                  </p>
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
                  Tuesday, March 18, 2025 | Auditorium, Q-building, Department of Radiotherapy, UMC Utrecht
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Coffee */}
                  <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                    <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                      9:00 - 9:30
                    </div>
                    <div className="flex-1 font-semibold text-foreground">
                      Coffee
                    </div>
                  </div>

                  {/* Opening */}
                  <div className="flex gap-4 pb-4 border-b border-border/50">
                    <div className="flex-shrink-0 w-32 font-semibold text-primary">
                      9:30 - 9:35
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">Opening Scientific Day</div>
                      <div className="text-sm text-muted-foreground">Nico van den Berg (UMC Utrecht)</div>
                    </div>
                  </div>

                  {/* Image Synthesis Session */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                    <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-xs font-bold">IS</div>
                      9:35 - 10:50 | Image Synthesis and Reconstruction
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">9:35 - 9:40</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">Introduction</div>
                          <div className="text-sm text-muted-foreground">Matteo Maspero (UMC Utrecht)</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">9:40 - 9:52</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Uncertainty estimation in female pelvic synthetic CT generated from iterative reconstructed CBCT</div>
                          <div className="text-sm text-muted-foreground">Yvonne de Hond, Catharina Ziekenhuis Eindhoven</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">9:52 - 10:04</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">A Plug-and-Play Method for Guided Multi-contrast MRI Reconstruction based on Content/Style Modeling</div>
                          <div className="text-sm text-muted-foreground">Chinmay Rao, Leiden UMC</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">10:04 - 10:16</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">The effect of dataset size and dataset curation in dose prediction for instantaneous treatment planning</div>
                          <div className="text-sm text-muted-foreground">Joep van Genderingen, Erasmus MC, Rotterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">10:16 - 10:28</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Angle dependent dose transformer algorithm for fast proton therapy dose calculations</div>
                          <div className="text-sm text-muted-foreground">Mikolaj Stryja, TU Delft</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">10:28 - 10:40</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Rapid clinical decision making via biplanar projections and deep learning</div>
                          <div className="text-sm text-muted-foreground">Musti Kadhim, Lund University - Skåne University Hospital</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">10:40 - 10:45</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Introduction SynthRAD2025 data challenge</div>
                          <div className="text-sm text-muted-foreground">Maarten Terpstra, UMC Utrecht or Adrian Thummerer, LMU Munich</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coffee Break */}
                  <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                    <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                      10:45 - 11:10
                    </div>
                    <div className="flex-1 font-semibold text-foreground">
                      Coffee
                    </div>
                  </div>

                  {/* Contouring & Registration Session */}
                  <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg p-4 border border-secondary/20">
                    <div className="text-sm font-semibold text-secondary uppercase tracking-wide mb-4 flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center text-xs font-bold">CR</div>
                      11:10 - 13:32 | Contouring & Registration
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">11:10 - 11:15</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">Introduction</div>
                          <div className="text-sm text-muted-foreground">Joren Brunekreef, NKI Amsterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">11:15 - 11:27</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Cross-institutional validation of prostate tumor auto-segmentation using multiparametric MRI</div>
                          <div className="text-sm text-muted-foreground">Ruben Bosschaert, NKI Amsterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">11:27 - 11:39</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Automated contouring in MR-guided adaptive radiotherapy for rectum cancer</div>
                          <div className="text-sm text-muted-foreground">Iris Kolenbrander, TU Eindhoven</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">11:39 - 11:51</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Manual Brush vs AI Pencil: Evaluating tools for auto-contour refinement of head-and-neck tumors</div>
                          <div className="text-sm text-muted-foreground">Prerak Mody, Leiden UMC</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">11:51 - 12:03</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Interpreting convolutional neural network explainability for head-and-neck cancer radiotherapy organ-at-risk segmentation</div>
                          <div className="text-sm text-muted-foreground">Victor Strijbis, University Bern</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">12:03 - 12:15</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Deep learning approaches for automated segmentation of focal cortical dysplasia (FCD) lesions</div>
                          <div className="text-sm text-muted-foreground">Petros Koutsouvelis, Maastricht University</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">12:15 - 12:27</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">A deep reinforcement learning approach for adaptive fractionation: Dynamic fraction size optimization for enhancing OAR sparing</div>
                          <div className="text-sm text-muted-foreground">Martin Weigand, NKI Amsterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">12:27 - 12:32</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Introducing the TrackRAD2025 Grand Challenge</div>
                          <div className="text-sm text-muted-foreground">Matteo Maspero, UMC Utrecht</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                    <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                      12:32 - 13:30
                    </div>
                    <div className="flex-1 font-semibold text-foreground">
                      Lunch
                    </div>
                  </div>

                  {/* Radiomics Session */}
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-4 border border-accent/20">
                    <div className="text-sm font-semibold text-accent-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-accent/30 flex items-center justify-center text-xs font-bold">RA</div>
                      13:30 - 14:50 | Radiomics
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">13:30 - 13:35</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">Introduction</div>
                          <div className="text-sm text-muted-foreground">Marianna Sijtsema (UMC Groningen)</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">13:35 - 13:50</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Digital Twin-Driven Framework for Lung Nodule Analysis: Identification, Segmentation, and Radiomics</div>
                          <div className="text-sm text-muted-foreground">Farshad Jafarpour, University Magna Graecia, Italy</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">13:50 - 14:05</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Deep learning-based prediction of radiation pneumonitis in advanced-staged lung cancer</div>
                          <div className="text-sm text-muted-foreground">Robert van der Wal, UMC Groningen</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">14:05 - 14:20</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Deep Learning based Xerostomia Prediction</div>
                          <div className="text-sm text-muted-foreground">Viktor Rogowski, Lund University - Skåne University Hospital</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">14:20 - 14:35</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Deep learning NTCP models for head and neck cancer toxicities</div>
                          <div className="text-sm text-muted-foreground">Suzanne de Vette, UMC Groningen</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">14:35 - 14:50</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Federated Survival Modeling with External Validation for Radiotherapy Outcomes in Oropharyngeal Cancer using F.A.I.R. Clinical and Radiomics Data</div>
                          <div className="text-sm text-muted-foreground">Varsha Gouthamchand, MAASTRO</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coffee/Tea Break */}
                  <div className="flex gap-4 py-3 bg-accent/30 rounded-lg px-4">
                    <div className="flex-shrink-0 w-32 font-semibold text-foreground">
                      14:50 - 15:10
                    </div>
                    <div className="flex-1 font-semibold text-foreground">
                      Coffee/tea break
                    </div>
                  </div>

                  {/* Clinical Implementation Session */}
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20">
                    <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-xs font-bold">CI</div>
                      15:10 - 16:15 | Clinical Implementation
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:10 - 15:15</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">Introduction</div>
                          <div className="text-sm text-muted-foreground">Charlotte Brouwer (UMCG)</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:15 - 15:25</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Clinical implementation of an auto-segmentation model for male pelvis MR</div>
                          <div className="text-sm text-muted-foreground">Bas Schipaanboord, NKI Amsterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:25 - 15:35</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Methods for Effective Postmarket Monitoring of AI-Enabled Medical Devices</div>
                          <div className="text-sm text-muted-foreground">Frida Hauler, Freelancer</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:35 - 15:45</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Monitoring auto-segmentation usage in the clinic</div>
                          <div className="text-sm text-muted-foreground">Rita Simões, NKI Amsterdam</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:45 - 15:55</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Proof of Concept of a cluster of VMs in the cloud using Azure</div>
                          <div className="text-sm text-muted-foreground">Sietske Bergsma, Isala, Zwolle</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">15:55 - 16:05</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Uncertainty visualisation: What do radiation oncologists and therapists want</div>
                          <div className="text-sm text-muted-foreground">Niels van Acht, Catharina Ziekenhuis, Eindhoven</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground">16:05 - 16:15</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">A DL-enhanced auto-contouring workflow for daily-adaptive prostate radiotherapy: Clinical implementation and first experiences</div>
                          <div className="text-sm text-muted-foreground">Cornel Zachiu, UMC Utrecht</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Closure */}
                  <div className="flex gap-4 pb-4 border-b border-border/50">
                    <div className="flex-shrink-0 w-32 font-semibold text-primary">
                      16:15
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">Closure</div>
                      <div className="text-sm text-muted-foreground">Charlotte Brouwer, UMC Groningen</div>
                    </div>
                  </div>

                  {/* Informal Drinks */}
                  <div className="flex gap-4 py-3 bg-primary/10 rounded-lg px-4">
                    <div className="flex-shrink-0 w-32 font-semibold text-primary">
                      After 16:15
                    </div>
                    <div className="flex-1 font-semibold text-foreground">
                      Informal drinks
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm">
                    <p>
                      <strong>Language:</strong> All presentations will be in English<br />
                      <strong>Endorsement:</strong> Under revision for endorsement by the Dutch Association of Clinical Physics (NVKF)<br />
                      <strong>Audience:</strong> Open to researchers, clinical physicists, industry professionals, and policymakers
                    </p>
                  </div>
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
