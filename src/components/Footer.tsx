import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Deep Learning in Radiotherapy</h3>
            <p className="text-sm text-muted-foreground mb-2">March 17-18, 2025</p>
            <p className="text-sm text-muted-foreground">UMC Utrecht, The Netherlands</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Matteo Maspero</p>
              <a 
                href="mailto:M.Maspero@umcutrecht.nl" 
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                M.Maspero@umcutrecht.nl
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Organizers</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Matteo Maspero (UMC Utrecht)</li>
              <li>Maarten Terpstra (UMC Utrecht)</li>
              <li>Charlotte Brouwer (UMCG)</li>
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
