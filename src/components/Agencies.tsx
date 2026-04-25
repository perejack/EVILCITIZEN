import { ArrowUpRight } from "lucide-react";
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

const agencies = [
  { name: "National Transport And Safety Authority (NTSA)", desc: "Dedicated platform for application and renewal of driving licence and driving school management.", logo: ntsa },
  { name: "Business Registration Services", desc: "Leverage BRS's digital platform for simplified and efficient business registration procedures.", logo: brs },
  { name: "Directorate of Immigration Services (eTA)", desc: "Kenya eTA is a semi-automated system that determines the eligibility of visitors to travel to Kenya.", logo: immigration },
  { name: "Kenya Revenue Authority", desc: "Enhance mobilisation of government revenue and facilitate growth in economic activities.", logo: kra },
  { name: "Directorate of Criminal Investigations", desc: "Access the DCI online platform for police clearance certificates and other services.", logo: dci },
  { name: "Kenya Wildlife Service", desc: "Explore. Experience. Conserve. Kenya's national parks and reserves.", logo: kws },
  { name: "Civil Registration Services", desc: "Conveniently apply and pay for birth and death registration services online.", logo: coa },
  { name: "Boma Yangu", desc: "Gateway into the Affordable Housing Program. Start your journey to home ownership.", logo: boma },
  { name: "National Council for Persons with Disabilities", desc: "Promote and protect equalization of opportunities and realization of human rights.", logo: ncpwd },
  { name: "Kenya Bureau of Standards (KEBS)", desc: "The premier government agency for standardization and quality assurance in Kenya.", logo: kebs },
  { name: "National Registration Bureau", desc: "Established in 1978 to implement the Registration of Persons Act.", logo: nrb },
  { name: "Kenya Copyright Board (KECOBO)", desc: "Central repository collating details pertaining to copyright and intellectual property.", logo: kcb },
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
            View all agencies <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agencies.map((a, i) => (
            <a
              key={a.name}
              href="#"
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-accent group-hover:text-white transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
