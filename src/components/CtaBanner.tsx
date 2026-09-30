import { Link } from "react-router-dom";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative">
        {/* Full-width banner background */}
        <div className="absolute inset-0">
          <img
            src="https://accounts.ecitizen.go.ke/en/images/banner-1.jpg"
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.28_0.06_175)]/95 via-[oklch(0.30_0.06_175)]/85 to-[oklch(0.32_0.05_180)]/55" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Now Available
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-balance">
              Over <span className="font-extrabold text-emerald-300">22,000</span> Government services now available from <span className="font-extrabold text-emerald-300">100+</span> Ministries, Counties, Departments and Agencies.
            </h2>
          </div>
        </div>

        {/* Bottom dark CTA strip */}
        <div className="relative bg-black/45 backdrop-blur-sm border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-white text-lg sm:text-xl font-semibold">
              Get started on eCitizen today
            </p>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold text-primary bg-white shadow hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-cta shadow hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
