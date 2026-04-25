// Shared types and helpers for generated certificates

export type TaxComplianceData = {
  pin: string;
  fullName: string;
  poBox: string;
  postalCode: string;
  reason: string;
  description: string;
  certNumber: string;
  issueDate: string; // dd/mm/yyyy
};

export type CrbData = {
  fullName: string;
  idNumber: string;
  serial: string;
  issueDate: string; // Month D, YYYY
};

export function generateKraCertNumber() {
  const n = Math.floor(1_000_000_000 + Math.random() * 9_000_000_000);
  return `KRABGM${n}`;
}

export function generateCrbSerial() {
  const a = Math.floor(10_000 + Math.random() * 90_000);
  const b = Math.floor(10_000_000 + Math.random() * 90_000_000);
  const c = Math.floor(100_000_000 + Math.random() * 900_000_000);
  return `CIC${a}-${b}-${c}`;
}

export function todayDdMmYyyy() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function todayLong() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPhoneToMsisdn(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return "254" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 9) return "254" + digits;
  if (digits.startsWith("1") && digits.length === 9) return "254" + digits;
  return null;
}
