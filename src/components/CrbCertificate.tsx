import { forwardRef } from "react";
import type { CrbData } from "@/lib/certificates";

type Props = { data: CrbData };

export const CrbCertificate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="relative bg-white text-[#111] mx-auto overflow-hidden"
      style={{ width: "794px", minHeight: "1123px", padding: "48px", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Top-left red curve */}
      <svg className="absolute top-0 left-0" width="500" height="180" viewBox="0 0 500 180">
        <path d="M0 0 L500 0 Q300 160 0 100 Z" fill="#C8102E" />
        <path d="M0 0 L420 0 Q260 130 0 70 Z" fill="#E63946" opacity="0.95" />
      </svg>

      {/* Bottom-right red curve */}
      <svg className="absolute bottom-0 right-0" width="400" height="120" viewBox="0 0 400 120">
        <path d="M400 120 L0 120 Q200 -20 400 60 Z" fill="#C8102E" opacity="0.9" />
      </svg>

      {/* Top meta */}
      <div className="relative flex items-start justify-between text-[12px]">
        <div>
          <p><span className="font-bold">Date of Issue</span> {data.issueDate}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Serial No.</p>
          <p className="mt-1">{data.serial}</p>
        </div>
      </div>

      {/* Logo */}
      <div className="relative mt-20 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -top-3 -left-1 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-[#C8102E]" />
              ))}
            </div>
            <div className="h-12 w-12 rounded-full border-[3px] border-[#C8102E] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#C8102E]">i</span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-[34px] font-extrabold text-[#222] tracking-tight">CREDIT</span>
            <span className="text-[34px] font-extrabold text-[#C8102E] tracking-tight">INFO</span>
          </div>
        </div>

        <h1 className="mt-6 text-[36px] font-bold text-[#222]" style={{ fontFamily: "Georgia, serif" }}>
          Clearance Certificate
        </h1>

        <p className="mt-6 text-[14px] text-gray-700 italic">This is to certify that</p>

        <h2 className="mt-2 text-[34px] font-bold text-[#222] tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
          {data.fullName.toUpperCase()}
        </h2>

        <p className="mt-2 text-[15px]"><span className="font-semibold">Of National ID</span> {data.idNumber}</p>

        <p className="mt-10 text-[20px] font-semibold text-[#222] text-center max-w-xl">
          Has no adverse listing as per information held by Creditinfo CRB Kenya Ltd
        </p>

        <p className="mt-6 text-[12px] text-gray-600 italic text-center">
          This certificate is valid at the date of issue, changes may occur after issue date
        </p>
      </div>

      {/* Signatures */}
      <div className="relative mt-16 grid grid-cols-2 gap-12 px-8">
        <div className="text-center">
          <p className="text-[26px]" style={{ fontFamily: "Brush Script MT, cursive" }}>S.Kuyile</p>
          <div className="border-t border-gray-500 mt-1" />
          <p className="mt-1 text-[12px] font-semibold">Chief Executive Officer</p>
        </div>
        <div className="text-center">
          <p className="text-[26px]" style={{ fontFamily: "Brush Script MT, cursive" }}>A.Maina</p>
          <div className="border-t border-gray-500 mt-1" />
          <p className="mt-1 text-[12px] font-semibold">Chief Operating Officer</p>
        </div>
      </div>

      <div className="relative mt-12 text-center text-[10px] text-gray-700 max-w-2xl mx-auto leading-relaxed">
        The Conclusion herein is based on the information obtained from public records and other third party sources.
        <br />
        Creditinfo makes no representation as to the accuracy of this information and shall not be liable for any loss, damages or claims whatsoever arising from reliance in this certificate.
      </div>
    </div>
  );
});
CrbCertificate.displayName = "CrbCertificate";
