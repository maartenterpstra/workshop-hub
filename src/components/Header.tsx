import { useState } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/program", label: "Program" },
    { to: "/registration", label: "Registration" },
    { to: "/venue", label: "Venue" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="DLinRT 2025 Logo" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground">DLinRT 2025</div>
              <div className="text-xs text-muted-foreground">Deep Learning in Radiotherapy</div>
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeClassName="text-primary font-semibold"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b bg-background p-4 md:hidden shadow-lg">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary py-2"
                  activeClassName="text-primary font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
