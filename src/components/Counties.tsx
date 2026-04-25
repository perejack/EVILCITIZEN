import { ArrowUpRight } from "lucide-react";
import mombasa from "@/assets/counties/mombasa.png";
import meru from "@/assets/counties/meru.png";
import tharaka from "@/assets/counties/tharaka.png";
import embu from "@/assets/counties/embu.png";
import kajiado from "@/assets/counties/kajiado.png";
import bomet from "@/assets/counties/bomet.png";
import kisumu from "@/assets/counties/kisumu.png";

const counties = [
  { code: "001", name: "Mombasa County", emblem: mombasa },
  { code: "012", name: "Meru County", emblem: meru },
  { code: "013", name: "Tharaka-Nithi County", emblem: tharaka },
  { code: "014", name: "Embu County", emblem: embu },
  { code: "034", name: "Kajiado County", emblem: kajiado },
  { code: "036", name: "Bomet County", emblem: bomet },
  { code: "042", name: "Kisumu County", emblem: kisumu },
];

export function Counties() {
  return (
    <section className="relative py-20 lg:py-28 bg-secondary/40">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Local Government</span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              All 47 counties, one portal
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Access local government services from any county in Kenya — all in one place.
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
            Browse all counties <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {counties.map((c, i) => (
            <a
              key={c.code}
              href="#"
              className="group relative flex items-center gap-4 p-5 bg-card rounded-2xl border border-border shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="relative h-16 w-16 shrink-0 rounded-xl bg-white flex items-center justify-center p-2 border border-border">
                <img src={c.emblem} alt={`${c.name} emblem`} loading="lazy" className="h-full w-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                <div className="text-base font-semibold text-foreground truncate">{c.name}</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
