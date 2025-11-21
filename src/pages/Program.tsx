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
                                  <Avatar className="h-8 w-8 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                                    {speakers[item.speakerId].avatarUrl && (
                                      <AvatarImage src={speakers[item.speakerId].avatarUrl} alt={speakers[item.speakerId].name} />
                                    )}
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {speakers[item.speakerId].initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-primary group-hover:underline">
                                      {speakers[item.speakerId].name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
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

          <TabsContent value="scientific" className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b">
                <CardTitle>Scientific Symposium</CardTitle>
                <CardDescription className="text-base">Friday, March 6, 2026</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {scientificSchedule.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="flex gap-4 pb-6 border-b last:border-0">
                      <div className="flex items-start gap-2 min-w-[140px] text-muted-foreground">
                        <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium">{session.time}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${
                          session.type === "break" ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {session.title}
                        </h3>
                        {session.chair && (
                          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Chair: {session.chair}
                          </p>
                        )}
                        {session.presentations && session.presentations.length > 0 && (
                          <div className="space-y-4 mt-4">
                            {session.presentations.map((presentation, presIndex) => (
                              <div 
                                key={presIndex} 
                                className={`pl-4 border-l-2 py-2 ${
                                  session.theme === "synthesis" ? "border-blue-500/50" :
                                  session.theme === "contouring" ? "border-green-500/50" :
                                  session.theme === "radiomics" ? "border-purple-500/50" :
                                  session.theme === "implementation" ? "border-orange-500/50" :
                                  "border-border"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xs font-medium text-muted-foreground min-w-[45px] mt-0.5">
                                    {presentation.time}
                                  </span>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-foreground mb-1">
                                      {presentation.title}
                                    </h4>
                                    {presentation.affiliation && (
                                      <p className="text-xs text-muted-foreground">
                                        {presentation.presenter} • {presentation.affiliation}
                                      </p>
                                    )}
                                    {!presentation.affiliation && (
                                      <p className="text-xs text-muted-foreground italic">
                                        {presentation.presenter}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
