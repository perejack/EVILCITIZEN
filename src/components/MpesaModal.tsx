import { useState, useEffect, useRef } from "react";
import { Loader2, Smartphone, CheckCircle2, X, RefreshCw } from "lucide-react";
import { formatPhoneToMsisdn } from "@/lib/certificates";

type Props = {
  open: boolean;
  amount: number;
  reference: string;
  onClose: () => void;
  onSuccess: () => void;
};

type Stage = "form" | "sending" | "waiting" | "success" | "error";

export function MpesaModal({ open, amount, reference, onClose, onSuccess }: Props) {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  if (!open) return null;

  const startPayment = async () => {
    const msisdn = formatPhoneToMsisdn(phone);
    if (!msisdn) {
      setError("Enter a valid Safaricom number e.g. 0712 345 678");
      return;
    }
    setError("");
    setStage("sending");

    try {
      const res = await fetch("/api/payhero/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          amount: amount,
          reference: reference,
          description: "Certificate processing fee",
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setStage("error");
        setError(data?.message || "Payment initiation failed. Please try again.");
        return;
      }

      const cid = data?.checkoutId ?? data?.reference ?? null;
      setCheckoutId(cid);
      setStage("waiting");
      setCountdown(60);

      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      // Auto-poll PayHero status API every 5 seconds
      if (pollRef.current) clearInterval(pollRef.current);
      const pollId = cid || reference;
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/payhero/status?checkoutId=${encodeURIComponent(pollId || "")}`);
          const data = await res.json().catch(() => null);
          if (data?.status === "completed") {
            if (countdownRef.current) clearInterval(countdownRef.current);
            if (pollRef.current) clearInterval(pollRef.current);
            setStage("success");
            setTimeout(() => onSuccess(), 1200);
          } else if (data?.status === "failed") {
            if (countdownRef.current) clearInterval(countdownRef.current);
            if (pollRef.current) clearInterval(pollRef.current);
            setStage("error");
            setError(data?.message || "Payment was not completed. Please try again.");
          }
        } catch (e) {
          // polling error — ignore and retry
        }
      }, 5000);
    } catch (err) {
      console.error("Payment error:", err);
      setStage("error");
      setError("Network error. Please check your connection and try again.");
    }
  };

  const handleConfirmPayment = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    setStage("success");
    setTimeout(() => onSuccess(), 1200);
  };

  const handleRetry = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    setError("");
    setStage("form");
    setCheckoutId(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-up">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={stage === "form" ? onClose : undefined} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-scale-in">
        {/* Header strip with M-Pesa green */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#00A859] to-[#007F3F] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-lg">
                M
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-90">Lipa na M-PESA</p>
                <p className="text-lg font-bold">Pay KES {amount.toLocaleString()}</p>
              </div>
            </div>
            {stage === "form" && (
              <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {stage === "form" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm">
                <p className="font-semibold text-emerald-900">Reference: {reference}</p>
                <p className="text-emerald-800/80 text-xs mt-0.5">An STK push will be sent to your phone.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Safaricom phone number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#00A859]/40"
                  />
                </div>
                {error && <p className="text-destructive text-xs mt-1.5">{error}</p>}
              </div>
              <button
                onClick={startPayment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00A859] to-[#007F3F] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Send STK Push
              </button>
              <p className="text-[11px] text-center text-muted-foreground">Secure payment processed by Safaricom M-PESA.</p>
            </div>
          )}

          {stage === "sending" && (
            <div className="py-10 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-[#00A859] animate-spin" />
              <p className="mt-4 font-semibold text-foreground">Initiating payment…</p>
              <p className="text-sm text-muted-foreground mt-1">Connecting to Safaricom</p>
            </div>
          )}

          {stage === "waiting" && (
            <div className="py-6 text-center">
              <div className="relative h-20 w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-[#00A859] border-t-transparent animate-spin" />
                <Smartphone className="absolute inset-0 m-auto h-8 w-8 text-[#00A859]" />
              </div>
              <p className="mt-5 font-semibold text-foreground">Check your phone</p>
              <p className="text-sm text-muted-foreground mt-1">An M-PESA STK push has been sent.<br/>Enter your PIN to complete payment.</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Waiting · {countdown}s
              </div>
              {checkoutId && (
                <p className="mt-2 text-[10px] text-muted-foreground">Ref: {checkoutId}</p>
              )}
              <button
                onClick={handleConfirmPayment}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-[#00A859] to-[#007F3F] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                I have completed payment
              </button>
              <button onClick={handleRetry} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto">
                <RefreshCw className="h-3 w-3" /> Resend STK Push
              </button>
            </div>
          )}

          {stage === "success" && (
            <div className="py-10 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="h-10 w-10 text-[#00A859]" />
              </div>
              <p className="mt-4 text-lg font-bold text-foreground">Payment received</p>
              <p className="text-sm text-muted-foreground mt-1">Generating your certificate…</p>
            </div>
          )}

          {stage === "error" && (
            <div className="py-10 text-center px-4">
              <div className="h-14 w-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                <X className="h-7 w-7 text-red-500" />
              </div>
              <p className="mt-4 font-semibold text-foreground">Payment failed</p>
              {error && <p className="mt-2 text-sm text-muted-foreground">{error}</p>}
              <button
                onClick={handleRetry}
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00A859] to-[#007F3F] text-white font-bold shadow-md hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                <RefreshCw className="h-4 w-4" /> Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
