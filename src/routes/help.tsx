import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

const channels = [
  { icon: Phone, title: "Call us", desc: "0709 123 456", color: "from-emerald-500 to-teal-600" },
  { icon: Mail, title: "Email", desc: "support@ecitizen.go.ke", color: "from-blue-500 to-indigo-600" },
  { icon: MessageCircle, title: "Live chat", desc: "Mon–Fri, 8am–5pm", color: "from-violet-500 to-purple-600" },
  { icon: HelpCircle, title: "FAQs", desc: "Browse common questions", color: "from-orange-500 to-red-500" },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-x-hidden">
        <section className="bg-gradient-hero text-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              We're here to <span className="italic font-light">help</span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              Reach out through any channel — our team is ready to assist with any government service.
            </p>
          </div>
        </section>
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {channels.map((c, i) => (
              <a key={c.title} href="#" className="group p-8 rounded-3xl bg-card border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <c.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{c.title}</h3>
                <p className="mt-1 text-muted-foreground">{c.desc}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
