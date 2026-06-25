import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, User, Coffee, UtensilsCrossed } from "lucide-react";
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
                      {session.title.toLowerCase().includes("coffee") && (
                        <Coffee className="w-5 h-5 text-primary" />
                      )}
                      {session.title.toLowerCase().includes("lunch") && (
                        <UtensilsCrossed className="w-5 h-5 text-primary" />
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