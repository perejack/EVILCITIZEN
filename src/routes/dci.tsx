import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Download, Loader2,
  Shield, ShieldCheck, Fingerprint, FileText, ChevronDown,
  AlertCircle, Info, Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MpesaModal } from "@/components/MpesaModal";
import {
  CertificateDocument,
  defaultCertificateTemplate,
  randomRef,
  safeFileName,
  todayCertDate,
  type CertificateData,
} from "@/components/CertificateDocument";
import dciLogo from "@/assets/agencies/dci.png";
import kenyaEmblem from "@/assets/kenya-emblem.png";

// ─── Types ─────────────────────────────────────────────────────────────────
type View = "intro" | "step1" | "step2" | "pay" | "issued";
type OwnerType = "" | "adult" | "child";

// ─── Fee table ─────────────────────────────────────────────────────────────
const FEES = [
  { label: "Police Clearance Certificate", amount: 10 },
  { label: "Convenience Fees", amount: 0 },
];
const TOTAL = FEES.reduce((s, f) => s + f.amount, 0); // 10

// ─── Processing steps (simulated) ──────────────────────────────────────────
const processingSteps = [
  { icon: FileText,    label: "Validating application details",   duration: 1200 },
  { icon: Fingerprint, label: "Cross-referencing fingerprint records", duration: 1800 },
  { icon: Shield,      label: "Checking criminal databases",         duration: 1500 },
  { icon: ShieldCheck, label: "Generating clearance status",          duration: 1000 },
];

// ─── Page component ─────────────────────────────────────────────────────────
export default function DciPage() {
  const [view, setView] = useState<View>("intro");
  const [pay, setPay] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cert, setCert] = useState<CertificateData | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [pccRef] = useState(() => randomRef());

  // Step 1 – Ownership
  const [ownerType, setOwnerType] = useState<OwnerType>("");
  const [step1Error, setStep1Error] = useState("");

  // Step 2 – Applicant details
  const [form, setForm] = useState({ fullName: "", idNumber: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Processing animation
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [view]);


  // ── Step 1 → Step 2
  const goToStep2 = () => {
    if (!ownerType) { setStep1Error("Please select the Police Clearance Owner."); return; }
    setStep1Error("");
    setView("step2");
  };

  // ── Step 2 → Processing → Pay
  const submitApplication = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "Enter your full name as it appears on your ID.";
    if (ownerType === "adult" && !/^\d{6,10}$/.test(form.idNumber.trim()))
      e.idNumber = "Enter a valid National ID number.";
    if (ownerType === "child" && form.idNumber.trim().length < 4)
      e.idNumber = "Enter a valid Birth Certificate number.";
    setFormErrors(e);
    if (Object.keys(e).length) return;

    setView("pay"); // show processing screen first
    setCurrentStep(0);
    setProgress(0);

    const totalDuration = processingSteps.reduce((a, s) => a + s.duration, 0);
    let elapsed = 0;
    processingSteps.forEach((step, i) => {
      setTimeout(() => setCurrentStep(i), elapsed);
      elapsed += step.duration;
    });

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 100 / (totalDuration / 50);
      });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setCurrentStep(processingSteps.length);
      setTimeout(() => setView("pay"), 400);
    }, totalDuration);

    setView("processing" as any);
  };

  // ── After M-Pesa success
  const onPaySuccess = () => {
    setPay(false);
    const certData: CertificateData = {
      ...defaultCertificateTemplate,
      holderName: form.fullName,
      idNumber: form.idNumber,
      refNo: pccRef,
      issueDate: todayCertDate(),
    };
    setCert(certData);
    setView("issued");
  };

  // ── Download PDF — applicant-genie pattern + font embedding fix ──────────
  const downloadPdf = async (kind: "pdf" | "png" = "pdf") => {
    const node = certRef.current;
    if (!node || !cert) return;
    setDownloading(true);

    let injectedStyle: HTMLStyleElement | null = null;

    try {
      const { toPng } = await import("html-to-image");

      // ── Embed Mrs Saint Delafield as base64 so canvas renders it ──────────
      // html-to-image can't use cross-origin Google Fonts inside canvas.
      // We pre-fetch the actual .woff2 file and inject a @font-face data-URL.
      try {
        // 1. Fetch the Google Fonts CSS (returns the @font-face with font URLs)
        const cssRes = await fetch(
          "https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap"
        );
        const cssText = await cssRes.text();

        // 2. Extract the first https font URL from the CSS
        const urlMatch = cssText.match(/url\(https:\/\/[^)]+\)/);
        if (urlMatch) {
          const fontUrl = urlMatch[0].replace(/url\(/, "").replace(/\)$/, "");
          const fontRes = await fetch(fontUrl);
          const buf = await fontRes.arrayBuffer();

          // 3. Convert to base64 in safe chunks (avoid stack overflow)
          const bytes = new Uint8Array(buf);
          let binary = "";
          const chunkSize = 8192;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(
              ...bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
            );
          }
          const b64 = btoa(binary);
          const fmt = fontUrl.includes(".woff2") ? "woff2" : "woff";

          // 4. Inject @font-face into <head> so html-to-image clone picks it up
          injectedStyle = document.createElement("style");
          injectedStyle.id = "__cert-sig-font__";
          injectedStyle.textContent = `@font-face {
            font-family: 'Mrs Saint Delafield';
            src: url(data:font/${fmt};base64,${b64}) format('${fmt}');
            font-weight: normal;
            font-style: normal;
          }`;
          document.head.appendChild(injectedStyle);
        }
      } catch {
        // Font embedding failed — signature will use system cursive fallback
        console.warn("Could not embed signature font; proceeding anyway.");
      }

      // ── Wait for all fonts (including injected) to be ready ───────────────
      await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;

      const opts = {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: { transform: "none", margin: "0" },
        cacheBust: true,
      };

      await toPng(node, opts); // warm-up pass — forces external resources to embed
      const png = await toPng(node, opts);

      const base = `${safeFileName(cert.holderName)}-${cert.refNo}`;
      if (kind === "png") {
        const a = document.createElement("a");
        a.href = png;
        a.download = `${base}.png`;
        a.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ unit: "px", format: [794, 1123], orientation: "portrait" });
        pdf.addImage(png, "PNG", 0, 0, 794, 1123);
        pdf.save(`${base}.pdf`);
      }
    } catch (err) {
      console.error("PDF error", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Clean up injected font style
      if (injectedStyle) injectedStyle.remove();
      setDownloading(false);
    }
  };

  const resetAll = () => {
    setView("intro");
    setOwnerType("");
    setStep1Error("");
    setForm({ fullName: "", idNumber: "" });
    setFormErrors({});
    setCert(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1 overflow-x-hidden">

        {/* ════════════════════════════════════════════════════════
            INTRO VIEW
        ════════════════════════════════════════════════════════ */}
        {view === "intro" && (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a3d62] via-[#1565a0] to-[#1e88e5]" />
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
              />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-white">
                <div className="flex items-center text-sm gap-2 opacity-80 mb-4">
                  <Link to="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <Link to="/national" className="hover:underline">National Services</Link>
                  <span>/</span>
                  <span>Certificate of Good Conduct</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  <div className="animate-fade-up">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={dciLogo} alt="DCI" className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
                        <Sparkles className="h-3.5 w-3.5" /> Directorate of Criminal Investigations
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance leading-tight">
                      Police Clearance Certificate
                      <span className="block italic font-light text-blue-200 mt-1">
                        (Certificate of Good Conduct)
                      </span>
                    </h1>
                    <p className="mt-4 text-white/90 text-base sm:text-lg max-w-xl leading-relaxed">
                      Apply online and pay for your Police Clearance Certificate. Present your invoice and C24 form
                      at <strong>DCI Headquarters</strong> for fingerprint processing.
                    </p>

                    <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                      <button
                        onClick={() => setView("step1")}
                        className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#0a3d62] font-bold shadow-xl hover:-translate-y-0.5 transition-transform text-sm sm:text-base"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </button>
                      <a
                        href="#how"
                        className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors text-sm sm:text-base"
                      >
                        How it works
                      </a>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
                      <Stat n="KES 10" label="Total Fee" />
                      <Stat n="Online" label="Application" />
                      <Stat n="DCI HQ" label="Submission" />
                    </div>
                  </div>

                  {/* Floating info card */}
                  <div className="hidden lg:block animate-scale-in">
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 rotate-1 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <img src={kenyaEmblem} alt="" className="h-10 w-10 object-contain" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Republic of Kenya</p>
                          <p className="font-bold text-[#0a3d62] text-sm">Directorate of Criminal Investigations</p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-gray-500">This is to certify that</p>
                      <p className="text-xl font-bold text-gray-800 mt-1" style={{ fontFamily: "Georgia, serif" }}>YOUR NAME HERE</p>
                      <p className="text-xs text-gray-500 mt-1">ID / BC No.: 00000000</p>
                      <div className="mt-4 bg-green-50 rounded-lg px-4 py-3">
                        <p className="text-sm font-semibold text-green-800">Has NO CRIMINAL RECORD</p>
                        <p className="text-xs text-green-600 mt-0.5">as per DCI Kenya records</p>
                      </div>
                      <div className="mt-4 flex justify-between text-xs text-gray-400">
                        <span>Ref: PCC-XXXXXXXX</span>
                        <span>{todayCertDate()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Information notice */}
            <div className="bg-blue-50 border-y border-blue-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <p className="font-semibold mb-1">Important Notice</p>
                    <p>This is an application form for persons <strong>over 18 years</strong>. You can apply for a Police Clearance Certificate (Good Conduct) and pay online using M-PESA. After payment, download and print your <strong>invoice (2 copies)</strong> and <strong>C24 form</strong>, then present at DCI HQ for fingerprinting.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Simple Process</span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Steps of Application</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { n: "1", icon: FileText,    title: "Fill the Form",        desc: "Read instructions carefully and fill in the application form with your details." },
                  { n: "2", icon: Shield,       title: "Pay Online",           desc: "Select M-PESA payment and pay your Police Clearance fee of KES 10." },
                  { n: "3", icon: Download,     title: "Download & Print",    desc: "Download 2 copies of invoice and 1 copy of C24 form printed on both sides of A4." },
                  { n: "4", icon: Fingerprint,  title: "Visit DCI HQ",        desc: "Present C24, invoice, and original National ID at DCI HQ for fingerprint processing." },
                ].map((s) => (
                  <div key={s.n} className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-border hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[#0a3d62] text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {s.n}
                      </div>
                      <s.icon className="h-5 w-5 text-[#1565a0]" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Fee table */}
              <div className="mt-12 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-center mb-4">Police Clearance Certificate Fees</h3>
                <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      {FEES.map((f) => (
                        <tr key={f.label} className="border-b border-border">
                          <td className="px-5 py-3.5 text-muted-foreground">{f.label}</td>
                          <td className="px-5 py-3.5 text-right font-semibold">KES {f.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#0a3d62] text-white">
                        <td className="px-5 py-4 font-bold">Total Fees</td>
                        <td className="px-5 py-4 text-right font-extrabold text-lg">KES {TOTAL.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* What to bring */}
              <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">During Submission at DCI HQ you need:</h4>
                    <ul className="space-y-1.5 text-sm text-amber-800">
                      <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /> Download TWO (2) copies of the invoice and ONE (1) copy of the C24 printed on both sides of A4.</li>
                      <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /> Applicant must be present in person.</li>
                      <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /> Original National ID card & photocopy (Adults) or Birth Certificate & copy (Minors).</li>
                      <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" /> Must allow fingerprints and palm prints to be recorded on the C24 form.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={() => setView("step1")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0a3d62] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-transform text-base"
                >
                  Start Application <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 1 — Ownership (mirrors screenshot exactly)
        ════════════════════════════════════════════════════════ */}
        {view === "step1" && (
          <section className="min-h-[80vh] bg-gray-50">
            {/* DCI page header bar */}
            <div className="bg-[#0a3d62] text-white">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center gap-3">
                <img src={kenyaEmblem} alt="" className="h-8 w-8 object-contain" />
                <span className="font-bold tracking-wide text-sm sm:text-base">Department of Criminal Investigations</span>
              </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
              {/* Title row */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Police Clearance Certificate</h1>
                <button
                  onClick={() => setView("intro")}
                  className="shrink-0 px-4 py-2 rounded bg-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  CANCEL
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row overflow-hidden">
                {/* Left nav */}
                <div className="sm:w-56 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Form Navigation</p>
                  <NavStep active index={1} label="Ownership" done={false} />
                  <NavStep active={false} index={2} label="Application Information" done={false} />
                </div>

                {/* Right form */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Ownership</h2>
                    <span className="text-sm text-gray-500">Step <strong>1</strong> / 2</span>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      1. Police Clearance Owner <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={ownerType}
                        onChange={(e) => { setOwnerType(e.target.value as OwnerType); setStep1Error(""); }}
                        className="w-full appearance-none border border-gray-300 rounded-md px-4 py-3 pr-10 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] text-sm"
                      >
                        <option value="">Choose...</option>
                        <option value="adult">Adult (18 years and above)</option>
                        <option value="child">Minor / Child (Below 18 years)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {step1Error && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {step1Error}
                      </p>
                    )}
                    {ownerType === "child" && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
                        <strong>Note:</strong> For minors, a Birth Certificate number is required. A parent/guardian must accompany the minor during fingerprint submission at DCI HQ.
                      </div>
                    )}
                    {ownerType === "adult" && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-800">
                        <strong>This application is for persons 18 years and above only.</strong> A valid National ID card is required.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={goToStep2}
                      className="px-7 py-2.5 rounded bg-[#2e7d32] text-white text-sm font-bold hover:bg-[#1b5e20] transition-colors"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════
            STEP 2 — Application Information
        ════════════════════════════════════════════════════════ */}
        {view === "step2" && (
          <section className="min-h-[80vh] bg-gray-50">
            <div className="bg-[#0a3d62] text-white">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center gap-3">
                <img src={kenyaEmblem} alt="" className="h-8 w-8 object-contain" />
                <span className="font-bold tracking-wide text-sm sm:text-base">Department of Criminal Investigations</span>
              </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
              <div className="flex items-start justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Police Clearance Certificate</h1>
                <button
                  onClick={() => setView("intro")}
                  className="shrink-0 px-4 py-2 rounded bg-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  CANCEL
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row overflow-hidden">
                {/* Left nav */}
                <div className="sm:w-56 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Form Navigation</p>
                  <NavStep active={false} index={1} label="Ownership" done />
                  <NavStep active index={2} label="Application Information" done={false} />
                </div>

                {/* Right form */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Application Information</h2>
                    <span className="text-sm text-gray-500">Step <strong>2</strong> / 2</span>
                  </div>

                  {/* Auto-filled fields */}
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <AppField label="Reference No." disabled value={pccRef} hint="Auto-generated" />
                    <AppField label="Date" disabled value={todayCertDate()} hint="Auto-filled today's date" />
                  </div>

                  {/* User-filled fields */}
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value.toUpperCase() })}
                        placeholder="e.g. CECILIA WANJIRU WAKARUGI"
                        className="dci-input"
                      />
                      {formErrors.fullName && <ErrMsg msg={formErrors.fullName} />}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {ownerType === "child" ? "Birth Certificate No." : "National ID Number"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.idNumber}
                        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                        placeholder={ownerType === "child" ? "e.g. 12345678" : "e.g. 33439482"}
                        inputMode="numeric"
                        className="dci-input"
                      />
                      {formErrors.idNumber && <ErrMsg msg={formErrors.idNumber} />}
                    </div>
                  </div>

                  {/* Record remarks (pre-filled NIL — read-only for display) */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Record Remarks</p>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Offence(s)</p>
                        <p className="font-semibold text-green-700">NIL</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Results of Trial</p>
                        <p className="font-semibold text-green-700">NIL</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Date</p>
                        <p className="font-semibold text-green-700">NIL</p>
                      </div>
                    </div>
                  </div>


                  <div className="flex justify-between">
                    <button
                      onClick={() => setView("step1")}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      onClick={submitApplication}
                      className="px-7 py-2.5 rounded bg-[#2e7d32] text-white text-sm font-bold hover:bg-[#1b5e20] transition-colors"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════
            PROCESSING VIEW
        ════════════════════════════════════════════════════════ */}
        {(view as string) === "processing" && (
          <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center animate-fade-up">
              <div className="relative h-28 w-28 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-[6px] border-[#0a3d62]/10" />
                <div className="absolute inset-0 rounded-full border-[6px] border-[#0a3d62] border-t-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full border-[4px] border-[#1565a0]/20 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                <Shield className="absolute inset-0 m-auto h-10 w-10 text-[#0a3d62] animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {currentStep < processingSteps.length ? processingSteps[currentStep].label : "Verification complete"}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">Securely querying DCI criminal records database…</p>

              <div className="mt-8 mx-auto max-w-sm">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0a3d62] to-[#1565a0] transition-all duration-200 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{Math.round(Math.min(progress, 100))}% complete</p>
              </div>

              <div className="mt-8 space-y-3 text-left">
                {processingSteps.map((step, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                        isDone ? "bg-emerald-50 border border-emerald-200" :
                        isActive ? "bg-blue-50 border border-[#0a3d62]/20 shadow-sm" :
                        "bg-muted/50 border border-transparent opacity-50"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isDone ? "bg-emerald-500 text-white" :
                        isActive ? "bg-[#0a3d62] text-white animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm font-semibold text-left ${
                        isDone ? "text-emerald-700" :
                        isActive ? "text-[#0a3d62]" :
                        "text-muted-foreground"
                      }`}>{step.label}</span>
                      {isActive && <Loader2 className="h-4 w-4 text-[#0a3d62] animate-spin ml-auto shrink-0" />}
                      {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════
            PAY VIEW
        ════════════════════════════════════════════════════════ */}
        {view === "pay" && (
          <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-up">
              <div className="bg-white rounded-3xl shadow-2xl border border-border p-6 sm:p-8 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center animate-scale-in">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold">Records Verified</h2>
                <p className="text-muted-foreground mt-2 text-sm">Your criminal records check is complete. Pay the processing fee to generate your certificate.</p>

                {/* Summary */}
                <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-4 text-left text-sm">
                  <div className="flex justify-between mb-1 text-gray-600">
                    <span>Applicant</span>
                    <span className="font-semibold text-gray-900">{form.fullName || "—"}</span>
                  </div>
                  <div className="flex justify-between mb-1 text-gray-600">
                    <span>Reference</span>
                    <span className="font-semibold font-mono text-[#0a3d62]">{pccRef}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Owner Type</span>
                    <span className="font-semibold capitalize text-gray-900">{ownerType}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-[#0a3d62]/10 border border-[#0a3d62]/20 p-5">
                  <p className="text-xs uppercase tracking-widest text-[#0a3d62] font-bold">Total Processing Fee</p>
                  <p className="text-5xl font-extrabold text-foreground mt-2">KES {TOTAL.toLocaleString()}</p>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {FEES.map((f) => (
                      <div key={f.label} className="flex justify-between">
                        <span>{f.label}</span>
                        <span>KES {f.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPay(true)}
                  className="mt-6 w-full py-4 rounded-full bg-gradient-to-r from-[#0a3d62] to-[#1565a0] text-white font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-base flex items-center justify-center gap-2"
                >
                  <span className="text-lg font-extrabold">M</span>
                  Pay KES {TOTAL.toLocaleString()} via M-PESA
                </button>
                <button onClick={() => setView("step2")} className="mt-3 text-sm text-muted-foreground hover:text-foreground">
                  ← Go back to edit details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════
            ISSUED VIEW
        ════════════════════════════════════════════════════════ */}
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
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Certificate of Good Conduct Issued</h1>
                      <p className="text-emerald-100 text-sm">Ref. No. {cert.refNo} · {cert.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={resetAll}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/25 transition-colors text-sm"
                    >
                      <ArrowLeft className="h-4 w-4" /> New Application
                    </button>
                    <button
                      onClick={() => downloadPdf("pdf")}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-emerald-700 font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {downloading ? "Generating PDF…" : "Download Certificate PDF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission reminder */}
            <div className="bg-amber-50 border-y border-amber-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex gap-3 items-start text-sm text-amber-800">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Next Step:</strong> Print <strong>2 copies of your invoice</strong> and <strong>1 copy of the C24</strong> on both sides of A4 paper.
                    Present at <strong>DCI Headquarters, Kiambu Road, Nairobi</strong> in person with your original National ID for fingerprinting.
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate display */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="overflow-hidden rounded-2xl shadow-card bg-gray-100 p-3 sm:p-6 lg:p-10 flex justify-center">
                <div className="cert-preview overflow-hidden rounded-md shadow-2xl">
                  <CertificateDocument ref={certRef} data={cert} />
                </div>
              </div>

              {/* Download buttons — same as applicant-genie */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => downloadPdf("pdf")}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a3d62] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {downloading ? "Generating PDF…" : "Download PDF"}
                </button>
                <button
                  onClick={() => downloadPdf("png")}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#0a3d62] text-[#0a3d62] font-bold hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed bg-white"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <MpesaModal
        open={pay}
        amount={TOTAL}
        reference={pccRef}
        onClose={() => setPay(false)}
        onSuccess={onPaySuccess}
      />

      <SiteFooter />

      <style>{`
        .dci-input {
          width: 100%; padding: 0.8rem 1rem; border-radius: 0.5rem;
          border: 1px solid #d1d5db; background: white; outline: none;
          transition: all .2s; font-size: 16px; -webkit-appearance: none;
          color: #111;
        }
        .dci-input:focus { border-color: #0a3d62; box-shadow: 0 0 0 3px rgba(10,61,98,0.12); }
        @media (min-width: 640px) { .dci-input { font-size: 14px; padding: 0.7rem 1rem; } }
      `}</style>
    </div>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────────
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="text-xl sm:text-2xl font-extrabold">{n}</p>
      <p className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function NavStep({ active, index, label, done }: { active: boolean; index: number; label: string; done: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 mb-3 text-sm ${active ? "font-bold text-gray-900" : "text-gray-400"}`}>
      <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
        done ? "bg-emerald-500 text-white" :
        active ? "bg-[#2e7d32] text-white" :
        "bg-gray-200 text-gray-500"
      }`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : index}
      </div>
      <span className="leading-snug">{label}</span>
    </div>
  );
}

function AppField({ label, value, disabled, hint }: { label: string; value: string; disabled?: boolean; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        value={value}
        readOnly={disabled}
        className="dci-input bg-gray-50 text-gray-500 cursor-not-allowed"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {msg}
    </p>
  );
}
