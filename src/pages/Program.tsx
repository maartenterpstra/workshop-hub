import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { educationalSchedule } from "@/data/scheduleEducational";
import { scientificSchedule } from "@/data/scheduleScientific";
import { speakers } from "@/data/speakers";
import { siteConfig } from "@/data/siteConfig";

const Program = () => {
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  const toggleSpeaker = (speakerId: string) => {
    setExpandedSpeaker(expandedSpeaker === speakerId ? null : speakerId);
  };

  // // Helper to determine border color for sessions based on theme
  // const getSessionBorderColor = (theme?: string) => {
  //   switch (theme) {
  //     case "synthesis": return "border-blue-600/30 bg-blue-50/80 dark:bg-blue-950/20";
  //     case "contouring": return "border-emerald-600/30 bg-emerald-50/80 dark:bg-emerald-950/20";
  //     case "clinical prediction": return "border-violet-600/30 bg-violet-50/80 dark:bg-violet-950/20";
  //     case "segmentation": return "border-amber-600/30 bg-amber-50/80 dark:bg-amber-950/20";
  //     default: return "border-border/50 bg-transparent";
  //   }
  // };

  // // Helper to determine icon background color for sessions based on theme
  // const getSessionThemeIconBg = (theme?: string) => {
  //   switch (theme) {
  //     case "synthesis": return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
  //     case "contouring": return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300";
  //     case "clinical prediction": return "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300";
  //     case "segmentation": return "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300";
  //     default: return "bg-primary/10 text-primary";
  //   }
  // };

  // const getThemeLabel = (theme?: string) => {
  //   switch (theme) {
  //     case "synthesis": return "Synthesis";
  //     case "contouring": return "Contouring";
  //     case "clinical prediction": return "Clinical Prediction";
  //     case "segmentation": return "Segmentation";
  //     default: return "General";
  //   }
  // };

  return (
    <div className="py-16 px-4">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Program</h1>
          <p className="text-xl text-muted-foreground mb-2">
            {siteConfig.dates}
          </p>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            {siteConfig.contact.department}, {siteConfig.contact.institution}
          </p>
        </div>

        <Tabs defaultValue="educational" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="educational">Educational Workshop</TabsTrigger>
            <TabsTrigger value="scientific">Scientific Symposium</TabsTrigger>
          </TabsList>

          <TabsContent value="educational" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle>Educational Workshop</CardTitle>
                <CardDescription className="text-base">Thursday, March 5, 2026</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {educationalSchedule.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-6 border-b last:border-0">
                      <div className="flex items-start gap-2 min-w-[140px] text-muted-foreground">
                        <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${
                              item.type === "break" ? "text-muted-foreground" : "text-foreground"
                            }`}>
                              {item.title}
                            </h3>
                            {item.speaker && item.speakerId && (
                              <>
                                <div 
                                  className="flex items-center gap-2 mb-2 cursor-pointer group"
                                  onClick={() => toggleSpeaker(item.speakerId!)}
                                >
                                  <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                                    {speakers[item.speakerId].avatarUrl && (
                                      <AvatarImage src={speakers[item.speakerId].avatarUrl} alt={speakers[item.speakerId].name} />
                                    )}
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {speakers[item.speakerId].initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-l font-medium text-primary group-hover:underline">
                                      {speakers[item.speakerId].name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {speakers[item.speakerId].affiliation}
                                    </p>
                                  </div>
                                </div>
                                {expandedSpeaker === item.speakerId && (
                                  <div className="ml-10 mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="text-sm text-muted-foreground">
                                      {speakers[item.speakerId].bio}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scientific" className="space-y-8">
            {scientificSchedule.map((session, sessionIndex) => (
              // If it's a break or general item like opening/closure, keep simple list style if desired
              // But based on the request, we want the "Card" style for sessions.
              // I will apply the card style to all non-break sessions to match the aesthetic.
              
              session.type === "break" ? (
                <div key={sessionIndex} className="py-6 my-6">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                    <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 border border-primary/20 rounded-full shadow-sm">
                      {session.title.toLowerCase().includes("opening") && (
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {session.title.toLowerCase().includes("coffee") && (
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                        </svg>
                      )}
                      {session.title.toLowerCase().includes("lunch") && (
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      <span className="text-base font-semibold text-primary">{session.title}</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                  </div>
                </div>
              ) : (
                // THE NEW AESTHETIC CARD LAYOUT with themeConfig colors
                <div key={sessionIndex} className={`rounded-lg p-6 border ${session.themeConfig?.border || 'border-border/50'} ${session.themeConfig?.bg || 'bg-transparent'}`}>
                  <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                    {/* Theme icon with colored background */}
                    <div className={`h-8 w-8 rounded flex items-center justify-center text-xs font-bold
                      ${session.themeConfig?.iconBg || 'bg-primary/10'} 
                      ${session.themeConfig?.iconText || 'text-primary'}
                    `}>
                      {session.title.split(":")?.[1]?.trim().substring(0, 2).toUpperCase()}
                    </div>
                    <span>{session.time}</span>
                  </div>

                  {/* Session Title and Chair */}
                  <div className="mb-4 pb-4 border-b border-border/50">
                    {/* {session.themeConfig && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${session.themeConfig.iconBg} ${session.themeConfig.iconText}`}>
                        {session.themeConfig.label}
                      </span>
                    )} */}
                    <h3 className="text-xl font-bold text-foreground mb-1">{session.title.split(':')[1] || session.title}</h3>
                    {session.chair && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Chair: {session.chair}
                      </p>
                    )}
                  </div>

                  {/* Presentations List */}
                  <div className="space-y-3">
                    {session.presentations && session.presentations.length > 0 ? (
                      session.presentations.map((presentation, presIndex) => (
                        <div key={presIndex} className="flex gap-4">
                          <div className="flex-shrink-0 w-24 text-sm font-medium text-foreground pt-1">
                            {presentation.time}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground mb-0.5 line-clamp-1" title={presentation.title}>
                              {presentation.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {presentation.presenter}
                              {presentation.affiliation && (
                                <>
                                  {" "}
                                  <span className="italic">({presentation.affiliation})</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div />
                      // <div className="flex gap-4">
                      //   {/* <div className="flex-shrink-0 w-24 text-sm font-medium text-muted-foreground pt-1">
                      //     {session.time}
                      //   </div> */}
                      //   {/* <div className="flex-1 text-muted-foreground italic">
                      //     No presentations listed.
                      //   </div> */}
                      // </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Program;