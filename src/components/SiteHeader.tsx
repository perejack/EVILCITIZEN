import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Search, Globe, Accessibility } from "lucide-react";
import logo from "@/assets/logo.svg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/national", label: "National" },
  { to: "/counties", label: "Counties" },
  { to: "/help", label: "Help & Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="h-1 kenya-stripe" />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-md" : "bg-background"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center shrink-0" aria-label="eCitizen Kenya" onClick={() => setOpen(false)}>
            <img src="https://accounts.ecitizen.go.ke/en/images/logo.svg" alt="eCitizen Kenya" className="h-10 sm:h-12 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-foreground hover:bg-muted ${isActive ? "text-accent bg-accent/10" : "text-muted-foreground"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-cta shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5"
            >
              Register
            </Link>
            <button
              aria-label="Language"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              aria-label="Accessibility"
              className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <Accessibility className="h-5 w-5" />
            </button>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-up">
            <nav className="flex flex-col p-4 gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-colors sm:hidden"
              >
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
