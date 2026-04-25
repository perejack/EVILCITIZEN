import citizenImage from "@/assets/stats-side.jpg";

const stats = [
  { value: "22K+", label: "Government Services" },
  { value: "100+", label: "Ministries & Agencies" },
  { value: "47", label: "Counties Connected" },
  { value: "10M+", label: "Active Citizens" },
];

export function StatsBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-white animate-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              Over <span className="text-gradient bg-gradient-to-r from-[oklch(0.85_0.18_150)] to-[oklch(0.92_0.10_80)] bg-clip-text text-transparent">22,000</span> services now available from <span className="italic font-light">100+</span> Ministries, Counties, Departments and Agencies.
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              Get started on eCitizen today and unlock the entire government in your pocket.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-white/70">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/login"
                className="inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold text-primary bg-white shadow-lg hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Sign in
              </a>
              <a
                href="/login"
                className="inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-cta shadow-lg hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Register now
              </a>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-cta opacity-30 blur-3xl" />
            <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={citizenImage}
                alt="Kenyan citizen showing national ID card"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-cta flex items-center justify-center text-white font-bold">✓</div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Verified Citizen</div>
                  <div className="text-xs text-muted-foreground">Single unified profile</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
