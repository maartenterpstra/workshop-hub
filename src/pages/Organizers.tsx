import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Compass, BookOpen, ClipboardCheck } from "lucide-react";
import { useState } from "react";

// Bundle all organizer photos so Vite resolves them for production.
const photoModules = import.meta.glob("@/assets/organizers/*.{jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const photoMap: Record<string, string> = Object.fromEntries(
  Object.entries(photoModules).map(([path, url]) => {
    const file = path.split("/").pop()!;
    const slug = file.replace(/\.(jpg|jpeg|png)$/i, "");
    return [slug, url];
  })
);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter((w) => !w.endsWith(".") && w.length > 1)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();


interface Person {
  name: string;
  title?: string;
  affiliation: string;
  region?: string;
  bioUrl?: string;
  photoUrl?: string;
}

const localOrganizers: Person[] = [
  { name: "Asst. Prof. Matteo Maspero", title: "Lead Organizer", affiliation: "UMC Utrecht", photoUrl: "/src/assets/organizers/matteo-maspero.jpg"  },
  { name: "Maarten Terpstra", affiliation: "UMC Utrecht", photoUrl: "/src/assets/organizers/maarten-terpstra.jpg"  },
  { name: "Prof. Nico van den Berg", affiliation: "UMC Utrecht", photoUrl: "/src/assets/organizers/nico-van-den-berg.png"  },
  { name: "Prof. Marry van den Heuvel-Eibrink", affiliation: "Princess Máxima Center, Utrecht", photoUrl: "/src/assets/organizers/marry-van-den-heuvel-eibrink.jpg"  },
  { name: "Geert Janssens", affiliation: "UMC Utrecht / Princess Máxima Center, Utrecht", photoUrl: "/src/assets/organizers/geert-janssens.jpg"  },
];

const regionalOrganizers: Person[] = [
  { name: "Assoc. Prof. Ana Barragán-Montero", affiliation: "UCLouvain", region: "BE", photoUrl: "/src/assets/organizers/ana-maria-barragan-montero.jpg"  },
  { name: "Assoc. Prof. Mauricio Reyes", affiliation: "ARTORG / University of Bern", region: "CH", photoUrl: "/src/assets/organizers/mauricio-reyes.jpg"  },
  { name: "Prof. Peter van Ooijen", affiliation: "UMC Groningen", region: "NL", photoUrl: "/src/assets/organizers/peter-van-ooijen.jpg" },
  { name: "Prof. Stine Korreman", affiliation: "Aarhus University / DCPT", region: "DK", photoUrl: "/src/assets/organizers/stine-korreman.jpg" },
  { name: "Prof. Claudio Fiorino", affiliation: "San Raffaele, Milano", region: "IT", photoUrl: "/src/assets/organizers/claudio-fiorino.jpg" },
  { name: "Prof. Javier Pascau", affiliation: "U. Carlos III, Madrid", region: "ES", photoUrl: "/src/assets/organizers/javier-pascau.jpg" },
  { name: "Dr. Eliana Vasquez Osorio", affiliation: "University of Manchester", region: "UK", photoUrl: "/src/assets/organizers/eliana-vasquez-osorio.jpg" },
  { name: "Barbara Knäusl", affiliation: "Medical University of Vienna", region: "AT", photoUrl: "/src/assets/organizers/barbara-knausl.jpg" },
  { name: "Assoc. Prof. Christian Gustafsson", affiliation: "Lund University", region: "SE", photoUrl: "/src/assets/organizers/christian-gustafsson.jpg" },
  { name: "Prof. Guillaume Landry", affiliation: "LMU Munich", region: "DE", photoUrl: "/src/assets/organizers/guillaume-landry.jpg" },
  { name: "Prof. Steve Jiang", affiliation: "UT Southwestern", region: "USA", photoUrl: "/src/assets/organizers/steve-jiang.jpg" },
];

const advisoryBoard: Person[] = [
  { name: "Prof. Jan-Jakob Sonke", affiliation: "Netherlands Cancer Institute", photoUrl: "/src/assets/organizers/jan-jakob-sonke.jpg" },
  { name: "Prof. Wouter van Elmpt", affiliation: "Maastro / Maastricht University", photoUrl: "/src/assets/organizers/wouter-van-elmpt.jpg" },
];

// SOC = all regional organizers + advisory board (per brief)
const soc: Person[] = [...regionalOrganizers];

const PersonCard = ({ p }: { p: Person }) => (
  <Card className="h-full">
    <CardContent className="pt-6 flex gap-4">
      <div className="h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg font-bold text-primary">
        <img src={p.photoUrl} alt={p.name} className="h-16 w-16 rounded-full object-cover" />
        {/* {p.name.split(" ").filter(w => !w.endsWith(".")).slice(-2).map(w => w[0]).join("")} */}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-semibold text-foreground">{p.name}</div>
          {p.region && <Badge variant="secondary" className="text-xs">{p.region}</Badge>}
        </div>
        {p.title && <div className="text-xs text-secondary font-medium">{p.title}</div>}
        <div className="text-sm text-muted-foreground">{p.affiliation}</div>
        {p.bioUrl && (
          <a href={p.bioUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
            Bio →
          </a>
        )}
      </div>
    </CardContent>
  </Card>
);

const Section = ({
  icon: Icon,
  title,
  description,
  people,
}: {
  icon: typeof Users;
  title: string;
  description: string;
  people: Person[];
}) => (
  <section className="mb-12">
    <div className="flex items-start gap-3 mb-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((p) => <PersonCard key={p.name} p={p} />)}
    </div>
  </section>
);

const Organizers = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Organizers & Committees
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The people behind AIinRT 2027.
          </p>
        </div>

        <Section
          icon={Users}
          title="Local Organizing Committee"
          description="Runs day-to-day organization of the workshop in Utrecht."
          people={localOrganizers}
        />

        <Section
          icon={Compass}
          title="Scientific Organizing Committee (SOC)"
          description="Shapes the scientific programme, oversees the peer-review process, and selects the accepted abstracts."
          people={soc}
        />

        <Section
          icon={BookOpen}
          title="Advisory Board"
          description="Provides strategic guidance to the SOC and the local team."
          people={advisoryBoard}
        />

        <section className="mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <ClipboardCheck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Reviewers</h2>
              <p className="text-muted-foreground text-sm">
                Volunteer experts who peer-review submitted abstracts across the six workshop topics.
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reviewer panel</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The full list of reviewers for the 2027 edition will be published here after
              the review process closes. Interested in reviewing? Contact the local
              organizers.
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Organizers;
