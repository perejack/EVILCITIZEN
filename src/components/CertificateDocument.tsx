import { forwardRef } from "react";
import crest from "@/assets/crest.png";

// ─── Types ────────────────────────────────────────────────────────────────────
export type CertificateData = {
  formCode: string;
  organisation: string;
  directorate: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  refNo: string;
  issueDate: string;
  title: string;
  preamble: string;
  holderName: string;
  idNumber: string;
  body: string;
  remarksHeading: string;
  offences: string;
  resultsOfTrial: string;
  recordDate: string;
  declaration: string;
  signatoryName: string;
  signatoryTitle: string;
  signatureText: string;
  noteText: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function randomRef(): string {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `PCC-${out}`;
}

export function todayCertDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function safeFileName(name: string): string {
  return (
    name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "certificate"
  );
}

// ─── Default template (matches official C.24A) ────────────────────────────────
export const defaultCertificateTemplate: Omit<CertificateData, "holderName" | "idNumber" | "refNo" | "issueDate"> = {
  formCode: "C. 24A",
  organisation: "NATIONAL POLICE SERVICE",
  directorate: "DIRECTORATE OF CRIMINAL INVESTIGATIONS",
  addressLine1: "DIRECTORATE OF CRIMINAL INVESTIGATIONS HEADQUARTERS",
  addressLine2: "P.O.Box 30036-00100 GPO",
  addressLine3: "NAIROBI, KENYA",
  title: "POLICE CLEARANCE CERTIFICATE",
  preamble: "I hereby certify that the fingerprints recorded from",
  body: "have been searched in Criminal Records Office's database with/without previous record. The validity of the information on this certificate is as of the date of issue.",
  remarksHeading: "REMARKS IN CASE OF PREVIOUS RECORD",
  offences: "NIL",
  resultsOfTrial: "NIL",
  recordDate: "NIL",
  declaration: "This Certificate has been issued without any alteration or any erasure",
  signatoryName: "(W.N KIRAI)",
  signatoryTitle: "For: Director, Directorate of Criminal Investigations",
  signatureText: "Kirai",
  noteText:
    "NOTE: This is a computer generated certificate, to verify the authenticity of this document, use the link https://dci.go.ke/verify; send DCI to 21546 Then Dial *512# and select \"Police Clearance\"",
};

// ─── Watermark row text ───────────────────────────────────────────────────────
const WATERMARK_ROW = "POLICE SERVICE Directorate of Criminal Investigations NATIONAL POLICE SERVICE ";

function DottedValue({ children, grow = true }: { children: React.ReactNode; grow?: boolean }) {
  return (
    <span
      className={`inline-block border-b border-dotted border-cert-ink/70 text-center font-bold ${
        grow ? "min-w-[120px]" : ""
      }`}
    >
      {children}
    </span>
  );
}

// ─── Certificate Document — exact copy of applicant-genie implementation ──────
export const CertificateDocument = forwardRef<HTMLDivElement, { data: CertificateData }>(
  function CertificateDocument({ data }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden bg-cert-paper font-serif-cert text-cert-ink"
        style={{ width: 794, height: 1123 }}
      >
        {/* Outer decorative frame */}
        <div className="absolute inset-0 border-[7px] border-cert-navy" />
        <div className="absolute inset-[7px] border-[7px] border-cert-gold" />
        <div className="absolute inset-[14px] border-[5px] border-cert-maroon" />

        {/* Security watermark text pattern */}
        <div className="pointer-events-none absolute inset-[22px] overflow-hidden opacity-[0.10]">
          {Array.from({ length: 46 }).map((_, i) => (
            <div
              key={i}
              className="whitespace-nowrap text-[7px] font-semibold tracking-tight text-cert-navy"
              style={{ lineHeight: "24px", marginLeft: (i % 3) * -40 }}
            >
              {WATERMARK_ROW.repeat(6)}
            </div>
          ))}
        </div>

        {/* Crest watermark */}
        <img
          src={crest}
          alt=""
          width={1024}
          height={768}
          className="pointer-events-none absolute left-1/2 top-[47%] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        />

        {/* Content */}
        <div className="relative flex h-full flex-col px-12 pb-6 pt-8">
          <div className="text-right text-[13px] font-bold tracking-wide">{data.formCode}</div>
          <div className="-mt-4 text-center text-[19px] tracking-wide">{data.organisation}</div>

          <img
            src={crest}
            alt="Service crest"
            width={1024}
            height={768}
            className="mx-auto mt-1 h-[120px] w-auto"
          />

          <h1 className="mt-2 text-center text-[27px] font-bold leading-tight tracking-tight">
            {data.directorate}
          </h1>
          <p className="mt-2 text-center text-[13px] leading-[1.25]">{data.addressLine1}</p>
          <p className="text-center text-[13px] leading-[1.25]">{data.addressLine2}</p>
          <p className="text-center text-[13px] leading-[1.25]">{data.addressLine3}</p>

          <div className="mt-5 flex items-end justify-between text-[15px]">
            <div>
              Ref. No. <span className="whitespace-nowrap font-bold">{data.refNo}</span>
            </div>
            <div>
              Date. <span className="font-bold">{data.issueDate}</span>
            </div>
          </div>

          <h2 className="mt-5 text-center text-[24px] font-bold leading-tight">{data.title}</h2>

          <p className="mt-3 text-[16px] italic">{data.preamble}</p>

          <div className="mt-2 border-b border-dotted border-cert-ink/70 pb-1 text-center text-[16px] font-bold tracking-wide">
            {data.holderName}
          </div>

          <p className="mt-4 text-[15.5px] italic leading-[2]">
            holder of ID No. <DottedValue>&nbsp;{data.idNumber}&nbsp;</DottedValue> {data.body}
          </p>

          <h3 className="mt-4 text-[16px] font-bold">{data.remarksHeading}</h3>

          <div className="mt-2 space-y-2 text-[15px]">
            <div className="border-b border-dotted border-cert-ink/70 pb-1">
              OFFENCE(S): <span className="font-bold">{data.offences}</span>
            </div>
            <div className="border-b border-dotted border-cert-ink/70 pb-1">
              RESULTS OF TRIAL: <span className="font-bold">{data.resultsOfTrial}</span>
            </div>
            <div className="border-b border-dotted border-cert-ink/70 pb-1">
              DATE: <span className="font-bold">{data.recordDate}</span>
            </div>
          </div>

          <p className="mt-4 text-[16px] font-bold italic">{data.declaration}</p>

          <div className="mt-auto">
            <div className="flex justify-end">
              <div className="w-[300px] text-center">
                <div
                  className="h-[86px] text-[52px] leading-[86px] text-cert-signature"
                  style={{ fontFamily: "'Mrs Saint Delafield', cursive" }}
                >
                  {data.signatureText}
                </div>
                <div className="text-[15px] font-bold">{data.signatoryName}</div>
                <div className="mt-1 border-t border-dotted border-cert-ink/70" />
              </div>
            </div>
            <p className="mt-1 text-right text-[15px] italic">{data.signatoryTitle}</p>
            <p className="text-right text-[15px] italic">(P.T.O)</p>

            <div className="mt-3 border border-cert-ink/30 bg-cert-paper/80 px-3 py-2 text-center text-[10.5px] leading-[1.5]">
              {data.noteText}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
