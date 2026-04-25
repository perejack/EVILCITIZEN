import { forwardRef } from "react";
import type { TaxComplianceData } from "@/lib/certificates";
import kraLogo from "@/assets/KRAlogo.png";

type Props = { data: TaxComplianceData };

const box = { display: "flex" as const };
const col = { display: "flex", flexDirection: "column" as const };

export const TaxComplianceCertificate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "48px",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#ffffff",
        color: "#111111",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...box,
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #d1d5db",
        }}
      >
        <div style={{ ...box, alignItems: "center", gap: "1rem" }}>
          <img src={kraLogo} alt="KRA Logo" style={{ height: "7rem", width: "auto", objectFit: "contain" } as React.CSSProperties} />
        </div>

        <div
          style={{
            padding: "1.25rem 2rem",
            background: "#e5e7eb",
            borderRadius: "0.25rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.25 }}>Tax Compliance</p>
          <p style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.25 }}>Certificate</p>
        </div>

        <div style={{ textAlign: "right", fontSize: "12px", lineHeight: 1.625 }}>
          <p style={{ fontWeight: 700 }}>For General Tax Questions</p>
          <p style={{ fontWeight: 700 }}>Contact KRA Call Centre</p>
          <p>Tel: +254 (020) 4999 999</p>
          <p>Cell: +254(0711)099 999</p>
          <p>Email: callcentre@kra.go.ke</p>
        </div>
      </div>

      {/* Taxpayer details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1.5rem",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #d1d5db",
          fontSize: "13px",
        }}
      >
        <div style={{ ...col, gap: "0.25rem" }}>
          <p><span style={{ fontWeight: 700 }}>Taxpayer PIN :</span> {data.pin}</p>
          <p style={{ fontWeight: 700 }}>Name and Address :</p>
          <p style={{ fontWeight: 700 }}>{data.fullName}</p>
          <p>P.O. Box {data.poBox}, Postal Code {data.postalCode}</p>
        </div>
        <div style={{ textAlign: "right", ...col, gap: "0.25rem" }}>
          <p><span style={{ fontWeight: 700 }}>Certificate Date:</span> {data.issueDate}</p>
          <p style={{ fontWeight: 700 }}>Certificate Number</p>
          <p style={{ fontWeight: 700 }}>{data.certNumber}</p>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "3rem 0",
          textAlign: "center",
          fontSize: "16px",
          lineHeight: 1.625,
          fontWeight: 600,
          maxWidth: "36rem",
          margin: "0 auto",
        }}
      >
        This is to confirm that {data.fullName}, Personal Identification Number {data.pin} has filed relevant tax returns and paid taxes due as provided by Law.
      </div>

      <div style={{ padding: "2rem 0", textAlign: "center", fontSize: "13px" }}>
        <p>This certificate is valid for one (1) year from the date of issue.</p>
        <p style={{ marginTop: "0.5rem" }}>It can be verified at the KRA iTax portal using the certificate number above.</p>
      </div>

      {/* Signature */}
      <div style={{ ...box, alignItems: "flex-end", justifyContent: "flex-end", marginTop: "3rem" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontStyle: "italic", fontSize: "22px", color: "#111111", fontFamily: "Brush Script MT, cursive" }}>
            R. Kamau
          </p>
          <div style={{ borderTop: "1px solid #6b7280", width: "12rem", marginLeft: "auto", marginTop: "0.25rem" }} />
          <p style={{ fontSize: "11px", marginTop: "0.25rem", fontWeight: 600 }}>Commissioner General</p>
          <p style={{ fontSize: "10px", color: "#4b5563" }}>Kenya Revenue Authority</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "4rem",
          paddingTop: "1rem",
          borderTop: "1px solid #d1d5db",
          fontSize: "10px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        This is a system-generated certificate and does not require a physical signature. KRA · Times Tower, Haile Selassie Avenue, Nairobi
      </div>
    </div>
  );
});
TaxComplianceCertificate.displayName = "TaxComplianceCertificate";
