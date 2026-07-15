import { useState } from "react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { Menu, X, LogOut } from "lucide-react";
import logoAsset from "@/assets/aiinrt2027-logo-horizontal.svg.asset.json";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const baseLinks = [
    { to: "/", label: "Home" },
    { to: "/program", label: "Program" },
    { to: "/submission", label: "Submission" },
    { to: "/registration", label: "Registration" },
    { to: "/venue", label: "Venue" },
    { to: "/organizers", label: "Organizers" },
    { to: "/reviewers", label: "Reviewers" },
  ];

  const authLinks: { to: string; label: string }[] = [];
  if (user) authLinks.push({ to: "/submit", label: "Submit Abstract" });
  if (roles.includes("reviewer") || roles.includes("soc") || roles.includes("admin"))
    authLinks.push({ to: "/review", label: "Review" });
  if (roles.includes("soc") || roles.includes("admin"))
    authLinks.push({ to: "/soc", label: "SOC" });

  const navLinks = [...baseLinks, ...authLinks];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logoAsset.url} alt="AIinRT2027" className="h-12 w-auto" />
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
          <a
            href="/2026/index.html"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary py-2"
          >
            Previous editions
          </a>
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          )}
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
              <a
                href="/2026/index.html"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary py-2"
              >
                Previous editions
              </a>
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start px-0">
                  <LogOut className="h-4 w-4 mr-1" /> Sign out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
