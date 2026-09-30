import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Globe, Accessibility, ArrowLeft } from "lucide-react";
import emblem from "@/assets/kenya-emblem.png";
import sideImage from "@/assets/login-side.jpg";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden">
      {/* Left: form */}
      <div className="relative flex flex-col px-6 sm:px-10 lg:px-16 py-8">
        <div className="h-1 kenya-stripe absolute top-0 left-0 right-0" />

        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="flex gap-2">
            <button aria-label="Language" className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors">
              <Globe className="h-5 w-5" />
            </button>
            <button aria-label="Accessibility" className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors">
              <Accessibility className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md animate-fade-up">
            <div className="flex items-center gap-3">
              <img src={emblem} alt="Republic of Kenya" width={48} height={48} className="h-12 w-12 object-contain" />
              <div className="h-10 w-px bg-border" />
              <img src="https://accounts.ecitizen.go.ke/en/images/logo.svg" alt="eCitizen Kenya" className="h-8 w-auto" />
            </div>

            <div className="mt-12">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary">One Login</h1>
              <p className="mt-2 text-lg text-muted-foreground">All Government Services</p>
            </div>

            <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email address or ID number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your email or ID number"
                  className="w-full px-4 py-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3.5 pr-32 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-input accent-accent" />
                  <span className="text-sm text-foreground">Remember for 30 days</span>
                </label>
                <a href="#" className="text-sm font-semibold text-accent hover:underline">
                  Forgot Password
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-cta text-white font-semibold shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Don't have an account?{" "}
                <a href="#" className="font-semibold text-accent hover:underline">
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Republic of Kenya. Secured login.
        </p>
      </div>

      {/* Right: image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={sideImage}
          alt="Kenyan citizens using the eCitizen mobile app"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/20" />
        <div className="absolute bottom-10 left-10 right-10 glass-dark rounded-3xl p-8 text-white animate-fade-up">
          <div className="text-3xl font-bold leading-tight text-balance">
            "Government services, finally simplified."
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-cta" />
            <div>
              <div className="text-sm font-semibold">Trusted by 10M+ Kenyans</div>
              <div className="text-xs text-white/70">Across all 47 counties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
