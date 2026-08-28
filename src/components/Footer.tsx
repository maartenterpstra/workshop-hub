import { Mail } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">{siteConfig.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{siteConfig.dates}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
            <p className="text-sm text-muted-foreground">Endorsed by ESTRO</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{siteConfig.contact.name}</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email2}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email2}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
