"use client";

import { isValidEmail, isValidPhone } from "@/lib/validation";
import { cleanSkills } from "@/lib/textFormat";

export default function Checklist({ personal, experience, education, projects }) {
  const checks = [
    { label: "Full name provided", pass: !!personal.fullName },
    { label: "Valid @gmail.com email", pass: isValidEmail(personal.email) },
    { label: "Valid phone with country code", pass: isValidPhone(personal.phone) },
    { label: "Professional summary written", pass: (personal.summary || "").length > 30 },
    {
      label: "3+ skills listed",
      pass: cleanSkills(personal.skills).split(",").filter((s) => s.trim()).length >= 3,
    },
    { label: "At least one experience or project", pass: experience.length > 0 || projects.length > 0 },
    { label: "Education section filled", pass: education.length > 0 },
    { label: "Single-column, no tables/graphics", pass: true },
  ];

  const passCount = checks.filter((c) => c.pass).length;
  const pct = Math.round((passCount / checks.length) * 100);

  return (
    <>
      <div className="bg-paper border border-line rounded-xl p-4 mb-3.5 text-center">
        <div
          className="w-20 h-20 mx-auto mb-2.5 rounded-full flex items-center justify-center relative font-display text-[18px] font-bold"
          style={{ background: `conic-gradient(#2E7D6B ${pct}%, #E3E5DF 0)` }}
        >
          <div className="absolute w-[62px] h-[62px] bg-paper rounded-full" />
          <span className="relative z-10 text-ink">{pct}%</span>
        </div>
        <p className="m-0 text-[12px] text-muted">ATS readiness score</p>
      </div>

      <div className="bg-paper border border-line rounded-xl p-4">
        <h3 className="font-display text-[12px] uppercase tracking-wide text-inksoft mb-2.5">Checklist</h3>
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-[12px] py-1.5 border-b border-bg last:border-b-0 text-inksoft">
            <span
              className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                c.pass ? "bg-accentsoft text-accent" : "bg-warnsoft text-warn"
              }`}
            >
              {c.pass ? "✓" : "!"}
            </span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
