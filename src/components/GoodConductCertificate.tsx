import { forwardRef } from "react";
import kenyaEmblem from "@/assets/kenya-emblem.png";
import dciLogo from "@/assets/agencies/dci.png";

export type GoodConductData = {
  fullName: string;
  idNumber: string;
  refNo: string;
  issueDate: string;
  ownerType: "adult" | "child";
};

export const GoodConductCertificate = forwardRef<HTMLDivElement, { data: GoodConductData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
          padding: "0",
          boxSizing: "border-box",
          border: "4px solid #0a3d62",
        }}
      >
        {/* Outer decorative border */}
        <div style={{ position: "absolute", inset: "8px", border: "1.5px solid #c0a000", pointerEvents: "none", zIndex: 1 }} />

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
            opacity: 0.05,
            pointerEvents: "none",
          }}
        >
          <img src={kenyaEmblem} alt="" style={{ width: "500px" }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, padding: "40px 56px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <img src={kenyaEmblem} alt="Kenya Emblem" style={{ height: "90px", objectFit: "contain" }} />
            <div style={{ textAlign: "center", flex: 1, padding: "0 24px" }}>
              <p style={{ fontSize: "11px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                Republic of Kenya
              </p>
              <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#0a3d62", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                Directorate of Criminal Investigations
              </h1>
              <p style={{ fontSize: "11px", color: "#666", margin: "0" }}>
                Department Headquarters, Kiambu Road, Nairobi
              </p>
            </div>
            <img src={dciLogo} alt="DCI Logo" style={{ height: "80px", objectFit: "contain" }} />
          </div>

          {/* Title banner */}
          <div style={{ background: "#0a3d62", color: "#fff", padding: "12px 24px", textAlign: "center", margin: "0 -8px 28px -8px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, letterSpacing: "3px", textTransform: "uppercase" }}>
              Police Clearance Certificate
            </h2>
            <p style={{ fontSize: "12px", margin: "4px 0 0", color: "#c0c0c0", letterSpacing: "1px" }}>
              Certificate of Good Conduct
            </p>
          </div>

          {/* Reference & Date row */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "12px", color: "#555" }}>
            <div>
              <span style={{ fontWeight: "bold", color: "#333" }}>Ref. No.: </span>
              <span style={{ fontFamily: "monospace", color: "#0a3d62", fontWeight: "bold" }}>{data.refNo}</span>
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: "#333" }}>Date: </span>
              <span>{data.issueDate}</span>
            </div>
          </div>

          {/* Certification text */}
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "24px 28px", marginBottom: "24px", background: "#f9f9f9" }}>
            <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#333", margin: "0 0 16px 0" }}>
              This is to certify that the following {data.ownerType === "child" ? "minor" : "person"} named hereunder has been checked against
              the criminal records held by the Directorate of Criminal Investigations, Republic of Kenya
              and the results are as indicated:
            </p>

            {/* Applicant details table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "16px" }}>
              <tbody>
                <Row label="Full Name" value={data.fullName.toUpperCase()} />
                <Row label={data.ownerType === "child" ? "Birth Certificate No." : "National ID Number"} value={data.idNumber} />
                <Row label="Reference No." value={data.refNo} />
                <Row label="Date of Issue" value={data.issueDate} />
              </tbody>
            </table>
          </div>

          {/* Records section */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "28px", border: "1px solid #ccc" }}>
            <thead>
              <tr style={{ background: "#0a3d62", color: "#fff" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: "bold", letterSpacing: "0.5px" }}>Offence(s)</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: "bold", letterSpacing: "0.5px" }}>Results of Trial</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: "bold", letterSpacing: "0.5px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#228B22", fontWeight: "bold" }}>NIL</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#228B22", fontWeight: "bold" }}>NIL</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#228B22", fontWeight: "bold" }}>NIL</td>
              </tr>
            </tbody>
          </table>

          {/* Remarks */}
          <div style={{ padding: "12px 16px", background: "#f0f7ff", border: "1px solid #c8dff5", borderRadius: "6px", marginBottom: "32px" }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#333" }}>
              <strong>Remarks:</strong> The above-named individual has <strong style={{ color: "#228B22" }}>NO CRIMINAL RECORD</strong> as
              per information held by the Directorate of Criminal Investigations, Kenya.
            </p>
          </div>

          {/* Signatures */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "28px" }}>
            <SigBlock title="Issued By" name="Inspector of Police" role="Records Officer, DCI HQ" />
            <SigBlock title="Authorised By" name="Superintendent of Police" role="Director of Criminal Investigations" />
          </div>

          {/* Official stamp placeholder */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%", border: "3px solid #0a3d62",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#0a3d62", textAlign: "center", fontSize: "8px", fontWeight: "bold",
              letterSpacing: "0.5px", lineHeight: "1.4",
            }}>
              <div style={{ fontSize: "10px", fontWeight: "bold" }}>OFFICIAL</div>
              <div>DCI</div>
              <div>KENYA</div>
              <div style={{ fontSize: "7px", color: "#666" }}>SEAL</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#888", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
              This certificate is issued pursuant to the Registration of Persons Act (Cap. 107) Laws of Kenya.
            </p>
            <p style={{ fontSize: "10px", color: "#888", margin: "0", letterSpacing: "0.5px" }}>
              Verify authenticity at <strong style={{ color: "#0a3d62" }}>dci.go.ke</strong> using Ref. No. <strong style={{ color: "#0a3d62" }}>{data.refNo}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
);

GoodConductCertificate.displayName = "GoodConductCertificate";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: "6px 8px", fontWeight: "bold", color: "#555", width: "200px", borderBottom: "1px solid #eee" }}>{label}</td>
      <td style={{ padding: "6px 8px", color: "#111", fontWeight: "bold", borderBottom: "1px solid #eee" }}>{value}</td>
    </tr>
  );
}

function SigBlock({ title, name, role }: { title: string; name: string; role: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{title}</p>
      <div style={{ height: "40px", borderBottom: "1.5px solid #333", marginBottom: "6px" }} />
      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#111", margin: "0 0 2px 0" }}>{name}</p>
      <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>{role}</p>
    </div>
  );
}
