import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.jpg";
import passportImg from "@/assets/services/passport.jpg";
import licenseImg from "@/assets/services/license.jpg";
import kraImg from "@/assets/services/kra.webp";
import crbImg from "@/assets/services/crb.jpg";
import birthImg from "@/assets/services/birth.jpg";
import conductImg from "@/assets/services/conduct.jpg";
import housingImg from "@/assets/services/housing.jpg";
import businessImg from "@/assets/services/business.jpg";
import marriageImg from "@/assets/services/marriage.jpg";

const quickServices = [
  { img: passportImg, label: "Apply for a Passport", to: "/national" as const },
  { img: licenseImg, label: "Apply for a Driving License", to: "/national" as const },
  { img: kraImg, label: "KRA Services", to: "/kra" as const },
  { img: crbImg, label: "CRB Clearance Certificate", to: "/crb" as const },
  { img: birthImg, label: "Apply for a Birth Certificate", to: "/national" as const },
  { img: conductImg, label: "Certificate of Good Conduct", to: "/national" as const },
  { img: housingImg, label: "Affordable Housing", to: "/national" as const },
  { img: businessImg, label: "Register a Business", to: "/national" as const },
  { img: marriageImg, label: "Marriage Certificate", to: "/national" as const },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Kenya"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-transparent to-accent/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Government of Kenya · Official Portal
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            Government of Kenya services{" "}
            <span className="italic font-light">simplified</span>
            <br />
            All your records{" "}
            <span className="text-gradient bg-gradient-to-r from-[oklch(0.85_0.18_150)] to-[oklch(0.92_0.10_80)] bg-clip-text text-transparent">
              unified
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 drop-shadow-md">
            One login. Every service. Search, apply and pay for over 22,000 government services from 100+ ministries, counties, departments and agencies.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mt-10 max-w-4xl animate-scale-in overflow-hidden rounded-2xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-cta opacity-30 blur-xl" />
          <div className="relative flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-2 shadow-card">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Search className="h-5 w-5 text-accent" />
            </div>
            <input
              type="text"
              placeholder="Type name of service, ministry, department, agency…"
              className="flex-1 bg-transparent border-0 outline-none text-base text-foreground placeholder:text-muted-foreground py-3 min-w-0"
            />
            <button className="hidden sm:inline-flex shrink-0 items-center px-6 py-3 rounded-xl bg-gradient-cta text-white text-sm font-semibold shadow-md hover:shadow-glow transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Quick services */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9 gap-3 sm:gap-4">
          {quickServices.map((s, i) => (
            <Link
              key={s.label}
              to={s.to}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md hover:bg-white transition-all hover:-translate-y-1 hover:shadow-card animate-fade-up text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.label}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </div>
              <span className="px-3 py-3 text-[12px] sm:text-[13px] font-semibold text-foreground leading-tight">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
