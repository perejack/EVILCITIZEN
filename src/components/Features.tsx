import { Lock, Monitor, AlarmClock } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "One log-in, all government services",
    desc: "All you need is one account. Citizens and residents can register with an ID number and access everything.",
  },
  {
    icon: Monitor,
    title: "A single unified citizen's profile",
    desc: "Your information as a citizen or resident from across government will be accessible through your profile.",
  },
  {
    icon: AlarmClock,
    title: "Convenient service access",
    desc: "Search, apply and pay for services online, receive progress notifications and access all downloads in one place.",
  },
];

export function Features() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why eCitizen</span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            Built for every Kenyan
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-8 lg:p-10 rounded-3xl bg-card border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
              <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-kenya-teal text-white shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                <f.icon className="h-7 w-7" strokeWidth={1.75} />
                <div className="absolute -inset-2 rounded-2xl bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="mt-6 text-xl lg:text-2xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-6 text-6xl font-bold text-muted/40 leading-none">0{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
