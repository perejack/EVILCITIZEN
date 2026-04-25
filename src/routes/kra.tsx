import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, ChevronRight, Home, FileText, CreditCard, ShieldCheck, Users, UserCog, Menu, Bell, Megaphone, Loader2, Download, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MpesaModal } from "@/components/MpesaModal";
import { TaxComplianceCertificate } from "@/components/TaxComplianceCertificate";
import {
  generateKraCertNumber,
  todayDdMmYyyy,
  type TaxComplianceData,
} from "@/lib/certificates";

type View = "list" | "apply" | "processing" | "pay" | "issued";

const services = [
  { id: "file", title: "File Returns", desc: "Submit your tax returns for the current or previous financial years." },
  { id: "amnesty", title: "Tax Amnesty", desc: "Apply for tax amnesty to regularize your tax obligations without penalties." },
  { id: "tcc", title: "Tax Compliance Certificate", desc: "Request a certificate to confirm your tax compliance status." },
  { id: "pin", title: "PIN Registration", desc: "Register and obtain a Personal Identification Number." },
  { id: "vat", title: "VAT Filing", desc: "File monthly VAT returns and reconcile input/output tax." },
  { id: "paye", title: "PAYE", desc: "Submit Pay As You Earn returns for your employees." },
  { id: "objection", title: "Tax Objection", desc: "Lodge an objection against an assessment." },
  { id: "waiver", title: "Penalty Waiver", desc: "Apply for waiver of penalties and interest." },
];

const sidebar = [
  { icon: Home, label: "Home" },
  { icon: FileText, label: "File Returns" },
  { icon: CreditCard, label: "Payments" },
  { icon: ShieldCheck, label: "Tax Compliance", active: true },
  { icon: Users, label: "Payroll" },
  { icon: UserCog, label: "Tax Agent" },
];

export default function KraPage() {
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [pay, setPay] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const [form, setForm] = useState({
    pin: "A0165....U",
    fullName: "",
    poBox: "",
    postalCode: "",
    reason: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cert, setCert] = useState<TaxComplianceData | null>(null);

  const filtered = services.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));

  const handleApply = () => {
    const e: Record<string, string> = {};
    if (!/^[A-Z]\d{9}[A-Z]$/i.test(form.pin.trim())) e.pin = "Enter a valid KRA PIN (e.g. A123456789Z)";
    if (form.fullName.trim().length < 3) e.fullName = "Enter your full name as on your ID";
    if (!form.poBox.trim()) e.poBox = "Required";
    if (!form.postalCode.trim()) e.postalCode = "Required";
    if (!form.reason) e.reason = "Select a reason";
    if (form.description.trim().length < 10) e.description = "Add more detail (min 10 chars)";
    setErrors(e);
    if (Object.keys(e).length) return;

    setView("processing");
    setTimeout(() => setView("pay"), 2200);
  };

  const onPaySuccess = () => {
    setPay(false);
    setCert({
      pin: form.pin.toUpperCase(),
      fullName: form.fullName.toUpperCase(),
      poBox: form.poBox,
      postalCode: form.postalCode,
      reason: form.reason,
      description: form.description,
      certNumber: generateKraCertNumber(),
      issueDate: todayDdMmYyyy(),
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
      pdf.save(`${cert.certNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* KRA shell */}
      <div className="flex-1 overflow-x-hidden">
        <div className="h-1 kenya-stripe" />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[calc(100vh-120px)]">
          {/* Mobile sidebar overlay */}
          {mobileSidebar && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebar(false)}
            />
          )}
          {/* Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex-col bg-[#B0241E] text-white transition-transform duration-300 ${
              mobileSidebar ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
            }`}
          >
            <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <span className="text-[#B0241E] font-extrabold text-sm lg:text-lg">KRA</span>
                </div>
                <div>
                  <p className="font-extrabold text-xs lg:text-sm leading-tight">KENYA REVENUE</p>
                  <p className="font-extrabold text-xs lg:text-sm leading-tight">AUTHORITY</p>
                  <p className="italic text-[10px] opacity-90 mt-0.5">Tulipe Ushuru, Tujitegemee!</p>
                </div>
              </div>
              <button
                className="lg:hidden p-1 rounded hover:bg-white/10"
                onClick={() => setMobileSidebar(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-2 lg:p-3 space-y-1 overflow-y-auto flex-1">
              {sidebar.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active ? "bg-white/15" : "hover:bg-white/10"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="flex flex-col">
            {/* KRA top bar */}
            <div className="bg-white border-b border-border">
              <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
                <button
                  className="lg:hidden p-2 rounded hover:bg-muted -ml-1"
                  onClick={() => setMobileSidebar(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden sm:flex items-center px-3 py-1.5 rounded border border-border text-sm">
                  Individual <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
                </div>
                <div className="flex-1" />
                <button className="hidden md:inline-flex items-center px-3 sm:px-4 py-1.5 rounded border border-border text-sm font-semibold">Checkers</button>
                <button className="inline-flex items-center px-3 sm:px-4 py-1.5 rounded bg-[#E97B22] text-white text-xs sm:text-sm font-semibold hover:bg-[#d96f1c] shrink-0">File Returns</button>
                <div className="relative shrink-0">
                  <Megaphone className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#B0241E] text-white text-[10px] flex items-center justify-center">0</span>
                </div>
                <div className="relative shrink-0">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#B0241E] text-white text-[10px] flex items-center justify-center">0</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
                <Link to="/" className="hover:text-foreground">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-semibold">KRA Services</span>
                {view !== "list" && (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground font-semibold">Tax Compliance</span>
                  </>
                )}
              </div>

              {view === "list" && (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground">KRA Services</h1>
                  <p className="text-muted-foreground mt-1">Self-service portal for taxpayers.</p>

                  {/* Search */}
                  <div className="mt-6 relative max-w-3xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search Service"
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-white focus:outline-none focus:ring-2 focus:ring-[#E97B22]/30"
                    />
                  </div>

                  <h2 className="mt-10 text-2xl font-bold">Domestic Services</h2>
                  <div className="mt-4 space-y-3">
                    {filtered.map((s) => (
                      <div
                        key={s.id}
                        className="group bg-[#F6F7F9] hover:bg-white hover:shadow-card transition-all rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-transparent hover:border-border"
                      >
                        <div>
                          <h3 className="font-bold text-foreground text-lg">{s.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{s.desc}</p>
                        </div>
                        <button
                          onClick={() => s.id === "tcc" ? setView("apply") : null}
                          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2 rounded-full border border-foreground/40 text-sm font-semibold hover:bg-foreground hover:text-white transition-colors"
                        >
                          Apply Now <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {view === "apply" && (
                <div className="max-w-3xl mx-auto animate-fade-up">
                  <button onClick={() => setView("list")} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back to services
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold">Tax Compliance</h1>
                  <div className="mt-6 bg-white rounded-2xl shadow-card p-4 sm:p-6 lg:p-8 border border-border">
                    <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">Apply for Tax Compliance Certificate</h2>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <Field label="KRA PIN *" error={errors.pin}>
                        <input value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.toUpperCase() })} className="kra-input" />
                      </Field>
                      <Field label="Full Name *" error={errors.fullName}>
                        <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="As on your ID" className="kra-input" />
                      </Field>
                      <Field label="P.O. Box *" error={errors.poBox}>
                        <input value={form.poBox} onChange={(e) => setForm({ ...form, poBox: e.target.value })} placeholder="e.g. 1234" className="kra-input" />
                      </Field>
                      <Field label="Postal Code *" error={errors.postalCode}>
                        <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="e.g. 00100" className="kra-input" />
                      </Field>
                      <Field label="Reason For Application *" error={errors.reason} className="sm:col-span-2">
                        <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="kra-input">
                          <option value="">Select..</option>
                          <option>Tender / Contract</option>
                          <option>Employment</option>
                          <option>Loan Application</option>
                          <option>Visa / Immigration</option>
                          <option>Government License</option>
                          <option>Other</option>
                        </select>
                      </Field>
                      <Field label="Description" error={errors.description} className="sm:col-span-2">
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Briefly describe the purpose…" className="kra-input resize-none" />
                      </Field>
                    </div>
                    <div className="flex justify-end mt-4 sm:mt-6">
                      <button
                        onClick={handleApply}
                        className="inline-flex items-center px-6 sm:px-8 py-3 rounded-full bg-[#E97B22] hover:bg-[#d96f1c] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5 text-sm sm:text-base"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {view === "processing" && (
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center max-w-md animate-scale-in">
                    <div className="relative h-28 w-28 mx-auto">
                      <div className="absolute inset-0 rounded-full border-[6px] border-[#E97B22]/15" />
                      <div className="absolute inset-0 rounded-full border-[6px] border-[#E97B22] border-t-transparent animate-spin" />
                      <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-[#E97B22] animate-pulse" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold">Processing your application…</h2>
                    <p className="mt-2 text-muted-foreground">We're validating your details against KRA records.</p>
                    <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
                      <Step done label="Submitted" />
                      <Step done label="Validating" />
                      <Step label="Payment" />
                    </div>
                  </div>
                </div>
              )}

              {view === "pay" && (
                <div className="max-w-xl mx-auto animate-fade-up">
                  <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-10 text-center">
                    <div className="h-14 w-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Application validated</h2>
                    <p className="text-muted-foreground mt-1">A processing fee is required to issue your certificate.</p>
                    <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#FFF6EE] to-[#FFEEDB] border border-[#E97B22]/30 p-6">
                      <p className="text-xs uppercase tracking-widest text-[#B65510] font-bold">Processing Fee</p>
                      <p className="text-5xl font-extrabold text-foreground mt-2">KES 950</p>
                      <p className="text-xs text-muted-foreground mt-2">Pay via M-PESA STK Push to complete and download.</p>
                    </div>
                    <button
                      onClick={() => setPay(true)}
                      className="mt-6 w-full py-3.5 rounded-full bg-foreground text-white font-bold hover:opacity-90 transition-opacity"
                    >
                      Complete & Pay KES 950
                    </button>
                    <button onClick={() => setView("apply")} className="mt-3 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                </div>
              )}

              {view === "issued" && cert && (
                <div className="animate-fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold">Your Tax Compliance Certificate</h1>
                      <p className="text-muted-foreground">Certificate No. {cert.certNumber}</p>
                    </div>
                    <button
                      onClick={downloadPdf}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E97B22] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {downloading ? "Generating..." : "Download PDF"}
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-card bg-gray-100 p-2 sm:p-4 lg:p-8">
                    <div className="min-w-0 flex justify-center">
                      <div
                        className="origin-top scale-[0.38] sm:scale-[0.55] md:scale-[0.75] lg:scale-100"
                        style={{ transformOrigin: "top center" }}
                      >
                        <TaxComplianceCertificate ref={certRef} data={cert} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MpesaModal
        open={pay}
        amount={950}
        reference={`TCC-${form.pin}`}
        onClose={() => setPay(false)}
        onSuccess={onPaySuccess}
      />

      <SiteFooter />

      <style>{`
        .kra-input { width: 100%; padding: 0.875rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border); background: white; outline: none; transition: all .2s; font-size: 16px; -webkit-appearance: none; }
        .kra-input:focus { border-color: #E97B22; box-shadow: 0 0 0 3px rgba(233,123,34,0.15); }
        @media (min-width: 640px) {
          .kra-input { font-size: 14px; padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className={`px-3 py-2 rounded-lg text-xs font-semibold ${done ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
      {done && "✓ "}{label}
    </div>
  );
}
