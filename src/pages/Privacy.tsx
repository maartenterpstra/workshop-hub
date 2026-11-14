import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { privacyContent as c } from "@/data/privacy";

const Privacy = () => (
  <div className="py-16 px-4">
    <div className="container max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Privacy policy</h1>
        <p className="text-muted-foreground">Last updated {c.lastUpdated}</p>
      </div>
      <Card className="shadow-card border-0 mb-6">
        <CardContent className="pt-6 space-y-2 text-muted-foreground">
          <p>{c.controller}</p>
          <p>
            Questions or requests:{" "}
            <a href={`mailto:${c.contactEmail}`} className="text-primary hover:underline">{c.contactEmail}</a>
          </p>
        </CardContent>
      </Card>
      {c.sections.map((s) => (
        <Card key={s.title} className="shadow-card border-0 mb-6">
          <CardHeader className="bg-primary/5 border-b"><CardTitle className="text-xl">{s.title}</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            {s.link && (
              <p className="mt-3 text-sm text-muted-foreground">
                {s.link.prefix}
                <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{s.link.label}</a>
                {s.link.prefix ? " explains how it handles it." : ""}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Privacy;
