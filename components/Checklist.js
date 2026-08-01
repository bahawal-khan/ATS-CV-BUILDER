"use client";

import { isValidEmail, isValidPhone } from "@/lib/validation";

export default function Checklist({ personal, experience, education, projects }) {
  const checks = [
    { label: "Full name provided", pass: !!personal.fullName },
    { label: "Valid @gmail.com email", pass: isValidEmail(personal.email) },
    { label: "Valid phone with country code", pass: isValidPhone(personal.phone) },
    { label: "Professional summary written", pass: (personal.summary || "").length > 30 },
    {
      label: "3+ skills listed",
      pass: (personal.skills || "").split(",").filter((s) => s.trim()).length >= 3,
    },
    { label: "At least one experience or project", pass: experience.length > 0 || projects.length > 0 },
    { label: "Education section filled", pass: education.length > 0 },
    { label: "Single-column, no tables/graphics", pass: true },
  ];

  const passCount = checks.filter((c) => c.pass).length;
  const pct = Math.round((passCount / checks.length) * 100);
  const ringColor = pct === 100 ? "#2E7D6B" : pct >= 60 ? "#4F5FE0" : "#D97706";

  return (
    <>
      <div className="bg-paper border border-line border-l-4 border-l-indigo rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-shadow duration-300 text-center animate-fadeInUp">
        <div
          className="w-24 h-24 mx-auto mb-3 rounded-full flex items-center justify-center relative font-display text-[19px] font-bold transition-[background] duration-500 ease-out"
          style={{ background: `conic-gradient(${ringColor} ${pct}%, #E4E7F1 0)` }}
        >
          <div className="absolute w-[76px] h-[76px] bg-paper rounded-full shadow-inner" />
          <span className="relative z-10 text-ink">{pct}%</span>
        </div>
        <p className="m-0 text-[12.5px] font-medium text-muted">ATS readiness score</p>
      </div>

      <div className="bg-paper border border-line rounded-2xl p-5 shadow-card hover:shadow-cardHover transition-shadow duration-300 animate-fadeInUp">
        <h3 className="font-display text-[12.5px] uppercase tracking-wide text-inksoft mb-3">Checklist</h3>
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[12.5px] py-2 border-b border-bg last:border-b-0 text-inksoft">
            <span
              className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 transition-colors duration-300 ${
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
