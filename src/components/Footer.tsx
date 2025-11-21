import { Mail } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">{siteConfig.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{siteConfig.dates}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
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
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Organizers</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {siteConfig.organizers.map((organizer, index) => (
                <li key={index}>
                  {organizer.name} ({organizer.institution})
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DLinRT Workshop Series. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
