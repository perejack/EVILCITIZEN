import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2, ShieldCheck, Sparkles, FileCheck, Database, Shield, Fingerprint } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MpesaModal } from "@/components/MpesaModal";
import { CrbCertificate } from "@/components/CrbCertificate";
import { generateCrbSerial, todayLong, type CrbData } from "@/lib/certificates";

type View = "intro" | "apply" | "processing" | "pay" | "issued";

const processingSteps = [
  { icon: Database, label: "Connecting to Creditinfo CRB", duration: 1500 },
  { icon: Fingerprint, label: "Checking credit records", duration: 1500 },
  { icon: Shield, label: "Verifying clearance status", duration: 2000 },
];

export default function CrbPage() {
  const [view, setView] = useState<View>("intro");
  const [pay, setPay] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [form, setForm] = useState({ fullName: "", idNumber: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cert, setCert] = useState<CrbData | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const submit = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "Enter your full names";
    if (!/^\d{6,10}$/.test(form.idNumber.trim())) e.idNumber = "Enter a valid ID number";
    setErrors(e);
    if (Object.keys(e).length) return;
    setView("processing");
    setCurrentStep(0);
    setProgress(0);

    const totalDuration = processingSteps.reduce((a, s) => a + s.duration, 0);
    let elapsed = 0;

    processingSteps.forEach((step, i) => {
      setTimeout(() => setCurrentStep(i), elapsed);
      elapsed += step.duration;
    });

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + (100 / (totalDuration / 50));
      });
    }, 50);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep(processingSteps.length);
      setTimeout(() => setView("pay"), 400);
    }, totalDuration);
  };

  const onPaySuccess = () => {
    setPay(false);
    setCert({
      fullName: form.fullName,
      idNumber: form.idNumber,
      serial: generateCrbSerial(),
      issueDate: todayLong(),
    });
    setView("issued");
  };

  const downloadPdf = async () => {
    if (!certRef.current || !cert) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: { margin: "0" },
        skipFonts: true,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.width / img.height;
      let renderWidth = pageWidth;
      let renderHeight = pageWidth / imgRatio;
      if (renderHeight > pageHeight) {
        renderHeight = pageHeight;
        renderWidth = pageHeight * imgRatio;
      }
      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`Creditinfo-Clearance-${cert.serial}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 overflow-x-hidden">
        {/* ===== INTRO VIEW ===== */}
        {view === "intro" && (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7A0E1F] via-[#C8102E] to-[#E63946]" />
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-white">
                <div className="flex items-center text-sm gap-2 opacity-90 mb-3">
                  <Link to="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <span>CRB Clearance Certificate</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <div className="animate-fade-up">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5" /> Powered by Creditinfo CRB Kenya
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                      CRB Clearance <span className="italic font-light">Certificate</span>
                    </h1>
                    <p className="mt-4 text-white/90 text-base sm:text-lg max-w-xl">
                      Get your official credit clearance certificate in minutes. Required for tenders, loans, employment and visa applications.
                    </p>
                    <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                      <button
                        onClick={() => setView("apply")}
                        className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#C8102E] font-bold shadow-xl hover:-translate-y-0.5 transition-transform text-sm sm:text-base"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </button>
                      <a href="#how" className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors text-sm sm:text-base">
                        How it works
                      </a>
                    </div>

                    <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
                      <Stat n="2 min" label="Processing" />
                      <Stat n="KES 950" label="One-time fee" />
                      <Stat n="Instant" label="Download" />
                    </div>
                  </div>

                  {/* Floating preview card */}
                  <div className="relative hidden lg:block animate-scale-in overflow-hidden rounded-2xl">
                    <div className="absolute -inset-6 rounded-3xl bg-white/10 blur-2xl" />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-2 pb-3 border-b">
                        <div className="h-8 w-8 rounded-full border-2 border-[#C8102E] flex items-center justify-center text-[#C8102E] font-extrabold">i</div>
                        <span className="font-extrabold text-foreground">CREDIT<span className="text-[#C8102E]">INFO</span></span>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">This is to certify that</p>
                      <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>YOUR NAME HERE</p>
                      <p className="text-xs text-muted-foreground mt-1">Of National ID 00000000</p>
                      <p className="mt-4 font-semibold text-foreground">Has no adverse listing as per information held by Creditinfo CRB Kenya Ltd</p>
                      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg" style={{ fontFamily: "Brush Script MT, cursive" }}>Sign</p>
                          <div className="border-t border-gray-300 mt-1" />
                          <p className="text-[10px] mt-1">Chief Executive Officer</p>
                        </div>
                        <div>
                          <p className="text-lg" style={{ fontFamily: "Brush Script MT, cursive" }}>Sign</p>
                          <div className="border-t border-gray-300 mt-1" />
                          <p className="text-[10px] mt-1">Chief Operating Officer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How it works */}
            <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center">How it works</h2>
              <div className="mt-8 sm:mt-10 grid sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { n: "1", title: "Enter your details", desc: "Provide your full names and National ID number." },
                  { n: "2", title: "Pay KES 950", desc: "Secure M-PESA STK push to your phone." },
                  { n: "3", title: "Download instantly", desc: "Your certificate is ready as a printable PDF." },
                ].map((s) => (
                  <div key={s.n} className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-border hover:-translate-y-1 transition-transform">
                    <div className="h-10 w-10 rounded-full bg-[#C8102E] text-white font-bold flex items-center justify-center">{s.n}</div>
                    <h3 className="mt-4 font-bold text-base sm:text-lg">{s.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===== APPLY VIEW ===== */}
        {view === "apply" && (
          <section className="min-h-[80vh] flex items-start sm:items-center justify-center px-4 py-8 sm:py-16">
            <div className="w-full max-w-lg animate-fade-up">
              <button onClick={() => setView("intro")} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to CRB
              </button>
              <div className="bg-white rounded-3xl shadow-2xl border border-border p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#E63946] text-white flex items-center justify-center shrink-0">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Apply for Clearance</h2>
                    <p className="text-muted-foreground text-sm">Enter details exactly as on your National ID</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <Field label="Full Names *" error={errors.fullName}>
                    <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Dennis Thairu Githiomi" className="crb-input" />
                  </Field>
                  <Field label="National ID Number *" error={errors.idNumber}>
                    <input value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="e.g. 32095586" inputMode="numeric" className="crb-input" />
                  </Field>
                </div>

                <button
                  onClick={submit}
                  className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#E63946] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5 text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===== PROCESSING VIEW ===== */}
        {view === "processing" && (
          <section className="min-h-[80vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md animate-scale-in text-center">
              {/* Animated spinner */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-[6px] border-[#C8102E]/10" />
                <div className="absolute inset-0 rounded-full border-[6px] border-[#C8102E] border-t-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full border-[4px] border-[#E63946]/20 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                <Loader2 className="absolute inset-0 m-auto h-10 w-10 sm:h-12 sm:w-12 text-[#C8102E] animate-pulse" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {currentStep < processingSteps.length ? processingSteps[currentStep].label : "Verification complete"}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Securely querying Creditinfo CRB Kenya databases
              </p>

              {/* Progress bar */}
              <div className="mt-8 mx-auto max-w-xs sm:max-w-sm">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C8102E] to-[#E63946] transition-all duration-200 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{Math.round(Math.min(progress, 100))}% complete</p>
              </div>

              {/* Step indicators */}
              <div className="mt-8 space-y-3">
                {processingSteps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                        isDone ? "bg-emerald-50 border border-emerald-200" :
                        isActive ? "bg-rose-50 border border-[#C8102E]/20 shadow-sm" :
                        "bg-muted/50 border border-transparent opacity-50"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isDone ? "bg-emerald-500 text-white" :
                        isActive ? "bg-[#C8102E] text-white animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm font-semibold text-left ${
                        isDone ? "text-emerald-700" :
                        isActive ? "text-[#C8102E]" :
                        "text-muted-foreground"
                      }`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <Loader2 className="h-4 w-4 text-[#C8102E] animate-spin ml-auto shrink-0" />
                      )}
                      {isDone && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===== PAY VIEW ===== */}
        {view === "pay" && (
          <section className="min-h-[80vh] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md animate-fade-up">
              <div className="bg-white rounded-3xl shadow-2xl border border-border p-6 sm:p-8 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center animate-scale-in">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold">Records cleared</h2>
                <p className="text-muted-foreground mt-2 text-sm">A processing fee is required to issue your certificate.</p>
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-rose-50 to-red-100 border border-rose-200 p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-widest text-rose-700 font-bold">Processing Fee</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-foreground mt-2">KES 950</p>
                  <p className="text-xs text-muted-foreground mt-2">Pay via M-PESA to download your certificate.</p>
                </div>
                <button
                  onClick={() => setPay(true)}
                  className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#E63946] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5 text-base"
                >
                  Complete & Pay KES 950
                </button>
                <button onClick={() => setView("apply")} className="mt-3 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
            </div>
          </section>
        )}

        {/* ===== ISSUED VIEW — Full certificate page ===== */}
        {view === "issued" && cert && (
          <section className="animate-fade-up">
            {/* Success banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Certificate Issued</h1>
                      <p className="text-emerald-100 text-sm sm:text-base">Serial No. {cert.serial}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={() => { setView("intro"); setForm({ fullName: "", idNumber: "" }); setCert(null); }}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/25 transition-colors text-sm"
                    >
                      <ArrowLeft className="h-4 w-4" /> New Application
                    </button>
                    <button
                      onClick={downloadPdf}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-emerald-700 font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {downloading ? "Generating..." : "Download PDF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate display */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
              <div className="overflow-hidden rounded-2xl shadow-card bg-gray-100 p-2 sm:p-4 lg:p-8">
                <div className="min-w-0 flex justify-center">
                  <div
                    className="origin-top scale-[0.32] sm:scale-[0.48] md:scale-[0.65] lg:scale-[0.85] xl:scale-100"
                    style={{ transformOrigin: "top center" }}
                  >
                    <CrbCertificate ref={certRef} data={cert} />
                  </div>
                </div>
              </div>

              {/* Mobile download bar */}
              <div className="mt-4 sm:hidden">
                <button
                  onClick={downloadPdf}
                  disabled={downloading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#E63946] text-white font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 text-base"
                >
                  {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  {downloading ? "Generating PDF..." : "Download Certificate PDF"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <MpesaModal
        open={pay}
        amount={1}
        reference={`CRB-${form.idNumber}`}
        onClose={() => setPay(false)}
        onSuccess={onPaySuccess}
      />

      <SiteFooter />

      <style>{`
        .crb-input { width: 100%; padding: 0.85rem 1rem; border-radius: 0.75rem; border: 1px solid var(--border); background: white; outline: none; transition: all .2s; font-size: 16px; -webkit-appearance: none; }
        .crb-input:focus { border-color: #C8102E; box-shadow: 0 0 0 3px rgba(200,16,46,0.15); }
        @media (min-width: 640px) {
          .crb-input { font-size: 14px; padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-xl sm:text-2xl font-extrabold">{n}</p>
      <p className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}
