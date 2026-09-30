import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ntsa from "@/assets/agencies/ntsa.png";
import brs from "@/assets/agencies/brs.png";
import immigration from "@/assets/agencies/immigration.png";
import kra from "@/assets/agencies/kra.png";
import dci from "@/assets/agencies/dci.png";
import kws from "@/assets/agencies/kws.jpg";
import coa from "@/assets/agencies/coa.png";
import boma from "@/assets/agencies/boma.png";
import ncpwd from "@/assets/agencies/ncpwd.jpg";
import kebs from "@/assets/agencies/kebs.png";
import nrb from "@/assets/agencies/nrb.jpg";
import kcb from "@/assets/agencies/kcb.jpg";

type Agency = {
  name: string;
  desc: string;
  logo: string;
  to: string;
  badge?: string;
  btnLabel?: string;
};

const agencies: Agency[] = [
  {
    name: "Directorate of Criminal Investigations",
    desc: "Apply for your Police Clearance Certificate (Certificate of Good Conduct) online. Pay and download your certificate from the DCI headquarters.",
    logo: dci,
    to: "/dci",
    badge: "Police Clearance",
    btnLabel: "Apply for Good Conduct",
  },
  {
    name: "National Transport And Safety Authority (NTSA)",
    desc: "Dedicated platform for application and renewal of driving licence and driving school management.",
    logo: ntsa,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Business Registration Services",
    desc: "Leverage BRS's digital platform for simplified and efficient business registration procedures.",
    logo: brs,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Directorate of Immigration Services (eTA)",
    desc: "Kenya eTA is a semi-automated system that determines the eligibility of visitors to travel to Kenya.",
    logo: immigration,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Kenya Revenue Authority",
    desc: "Enhance mobilisation of government revenue and facilitate growth in economic activities.",
    logo: kra,
    to: "/kra",
    btnLabel: "KRA Services",
  },
  {
    name: "Kenya Wildlife Service",
    desc: "Explore. Experience. Conserve. Kenya's national parks and reserves.",
    logo: kws,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Civil Registration Services",
    desc: "Conveniently apply and pay for birth and death registration services online.",
    logo: coa,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Boma Yangu",
    desc: "Gateway into the Affordable Housing Program. Start your journey to home ownership.",
    logo: boma,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "National Council for Persons with Disabilities",
    desc: "Promote and protect equalization of opportunities and realization of human rights.",
    logo: ncpwd,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Kenya Bureau of Standards (KEBS)",
    desc: "The premier government agency for standardization and quality assurance in Kenya.",
    logo: kebs,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "National Registration Bureau",
    desc: "Established in 1978 to implement the Registration of Persons Act.",
    logo: nrb,
    to: "/national",
    btnLabel: "Access Services",
  },
  {
    name: "Kenya Copyright Board (KECOBO)",
    desc: "Central repository collating details pertaining to copyright and intellectual property.",
    logo: kcb,
    to: "/national",
    btnLabel: "Access Services",
  },
];

export function Agencies() {
  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Discover</span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              Agencies you can access
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              From passports to property — connect with every government agency through a single trusted portal.
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
            View all agencies <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agencies.map((a, i) => (
            <div
              key={a.name}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-card hover:-translate-y-1 transition-all animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Badge for featured services */}
              {a.badge && (
                <span className="absolute top-3 right-3 z-10 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow">
                  {a.badge}
                </span>
              )}

              {/* Logo area */}
              <div className="p-6 pb-4">
                <div className="flex h-16 items-center mb-4 pb-4 border-b border-border">
                  <img
                    src={a.logo}
                    alt={`${a.name} logo`}
                    loading="lazy"
                    className="h-full w-auto max-w-[160px] object-contain"
                  />
                </div>
                <h3 className="text-base lg:text-lg font-bold text-foreground leading-snug">{a.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.desc}</p>
              </div>

              {/* Action button */}
              <div className="mt-auto px-6 pb-6">
                <Link
                  to={a.to}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all group-hover:shadow-md"
                >
                  {a.btnLabel ?? "Access Services"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
