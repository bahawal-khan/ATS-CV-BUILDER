"use client";

import { useState, useCallback } from "react";
import ListSection from "./ListSection";
import Preview from "./Preview";
import Checklist from "./Checklist";
import Toast from "./Toast";
import { COUNTRIES, flagEmoji } from "@/lib/countries";
import { isValidEmail, isValidPhone, validateResume } from "@/lib/validation";
import { exportResumePdf } from "@/lib/exportPdf";
import { exportResumeWord } from "@/lib/exportWord";

let idCounter = 0;
function uid() {
  idCounter += 1;
  return `id_${Date.now()}_${idCounter}`;
}

const EXPERIENCE_FIELDS = [
  { key: "title", label: "Job Title", placeholder: "Data Analyst" },
  { key: "company", label: "Company", placeholder: "Systems Ltd." },
  { key: "location", label: "Location", placeholder: "Karachi, PK" },
  { key: "start", label: "Duration", placeholder: "Jan 2023 – Present" },
  { key: "bullets", label: "Bullet points (one per line)", placeholder: "Built dashboards used by...", type: "textarea" },
];

const EDUCATION_FIELDS = [
  { key: "degree", label: "Degree", placeholder: "BS Computer Science" },
  { key: "institution", label: "Institution", placeholder: "University of Karachi" },
  { key: "year", label: "Year", placeholder: "2023" },
  { key: "gpa", label: "GPA / Result (optional)", placeholder: "3.6/4.0" },
];

const PROJECT_FIELDS = [
  { key: "name", label: "Project Name", placeholder: "Retail Demand Forecasting" },
  { key: "description", label: "Description", placeholder: "Built a model that...", type: "textarea" },
  { key: "tech", label: "Tech Used", placeholder: "Python, XGBoost" },
];

const CERT_FIELDS = [
  { key: "name", label: "Certification", placeholder: "Google Data Analytics Certificate" },
  { key: "issuer", label: "Issuer", placeholder: "Coursera / Google" },
  { key: "year", label: "Year", placeholder: "2023" },
];

export default function ResumeBuilder() {
  const [personal, setPersonal] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    countryCode: "+92",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    skills: "",
  });
  const [errors, setErrors] = useState({});
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = useCallback((message, type = "error") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  function updatePersonal(field, value) {
    setPersonal((p) => ({ ...p, [field]: value }));
  }

  function handleEmailBlur() {
    setErrors((e) => ({ ...e, email: isValidEmail(personal.email) || !personal.email ? null : "Must end in @gmail.com" }));
  }
  function handlePhoneBlur() {
    setErrors((e) => ({ ...e, phone: isValidPhone(personal.phone) || !personal.phone ? null : "6–14 digits only" }));
  }

  // generic list helpers
  function makeListHandlers(setList, defaultItem) {
    return {
      add: () => {
        try {
          setList((list) => [...list, { id: uid(), ...defaultItem }]);
        } catch (e) {
          console.error(e);
          showToast("Could not add entry. Please try again.");
        }
      },
      update: (id, field, value) => {
        try {
          setList((list) => list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
        } catch (e) {
          console.error(e);
          showToast("Could not update entry.");
        }
      },
      remove: (id) => {
        try {
          setList((list) => list.filter((item) => item.id !== id));
        } catch (e) {
          console.error(e);
          showToast("Could not remove entry.");
        }
      },
    };
  }

  const expHandlers = makeListHandlers(setExperience, { title: "", company: "", location: "", start: "", bullets: "" });
  const eduHandlers = makeListHandlers(setEducation, { degree: "", institution: "", year: "", gpa: "" });
  const projHandlers = makeListHandlers(setProjects, { name: "", description: "", tech: "" });
  const certHandlers = makeListHandlers(setCerts, { name: "", issuer: "", year: "" });

  function runValidation() {
    const { errors: newErrors, isValid } = validateResume(personal);
    setErrors(newErrors);
    if (!isValid) {
      const firstMsg = Object.values(newErrors)[0];
      showToast(firstMsg || "Please fix the highlighted fields.");
    }
    return isValid;
  }

  async function handleDownloadPdf() {
    if (!runValidation()) return;
    setIsExporting(true);
    try {
      exportResumePdf({ personal, experience, education, projects, certs });
      showToast("PDF downloaded.", "success");
    } catch (e) {
      console.error("PDF export failed:", e);
      showToast("Could not generate the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDownloadWord() {
    if (!runValidation()) return;
    setIsExporting(true);
    try {
      await exportResumeWord({ personal, experience, education, projects, certs });
      showToast("Word file downloaded.", "success");
    } catch (e) {
      console.error("Word export failed:", e);
      showToast("Could not generate the Word file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  function loadSample() {
    try {
      setPersonal({
        fullName: "Ayesha Khan",
        jobTitle: "Data Analyst",
        email: "ayesha.khan@gmail.com",
        countryCode: "+92",
        phone: "3001234567",
        location: "Karachi, Pakistan",
        linkedin: "linkedin.com/in/ayeshakhan",
        summary:
          "Data analyst with 2 years of experience turning raw business data into clear, actionable insights using SQL, Python, and Power BI. Strong record of building dashboards that reduced reporting time by 40%.",
        skills: "Python, SQL, Power BI, Excel, Pandas, Data Visualization, A/B Testing, Statistics",
      });
      setExperience([
        {
          id: uid(),
          title: "Data Analyst",
          company: "Systems Ltd.",
          location: "Karachi, PK",
          start: "Jan 2024 – Present",
          bullets:
            "Built 6 Power BI dashboards used weekly by 3 department heads\nAutomated a manual reporting process, saving 8 hours/week\nAnalyzed customer churn data and identified 3 key drivers",
        },
      ]);
      setEducation([{ id: uid(), degree: "BS Computer Science", institution: "University of Karachi", year: "2023", gpa: "3.6/4.0" }]);
      setProjects([
        {
          id: uid(),
          name: "Retail Demand Forecasting",
          description: "Built an XGBoost model to forecast weekly product demand across 50 stores, improving forecast accuracy by 18% over the baseline.",
          tech: "Python, XGBoost, Pandas",
        },
      ]);
      setCerts([{ id: uid(), name: "Google Data Analytics Certificate", issuer: "Coursera / Google", year: "2023" }]);
      setErrors({});
      showToast("Sample data loaded.", "success");
    } catch (e) {
      console.error(e);
      showToast("Could not load sample data.");
    }
  }

  return (
    <div className="min-h-screen">
      <Toast toasts={toasts} />

      <header className="px-4 sm:px-8 py-6 border-b border-line bg-paper">
        <h1 className="font-display text-[19px] sm:text-[22px] font-bold mb-1 tracking-tight">ATS Resume Builder</h1>
        <p className="text-muted text-[12.5px] sm:text-[13.5px] m-0">
          Fill in your details — get a plain, parser-safe resume. No tables, no icons, no columns — just what applicant tracking systems can actually read.
        </p>
      </header>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px_560px]">
        {/* FORM */}
        <div className="p-4 sm:p-5 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto order-1">
          <div className="bg-paper border border-line border-l-4 border-l-[#3B82F6] rounded-xl p-4 mb-3.5">
            <SectionHeading icon="👤" color="#3B82F6" bg="#DBEAFE">
              Contact
            </SectionHeading>

            <div className="flex flex-wrap gap-2.5">
              <Field label="Full Name *" className="flex-1 min-w-[140px]">
                <input
                  className={inputClass(errors.fullName)}
                  placeholder="Ayesha Khan"
                  value={personal.fullName}
                  onChange={(e) => updatePersonal("fullName", e.target.value)}
                />
              </Field>
              <Field label="Target Job Title" className="flex-1 min-w-[140px]">
                <input
                  className={inputClass()}
                  placeholder="Data Analyst"
                  value={personal.jobTitle}
                  onChange={(e) => updatePersonal("jobTitle", e.target.value)}
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Field label="Email * (must be a gmail.com address)" className="flex-1 min-w-[140px]">
                <input
                  className={inputClass(errors.email)}
                  placeholder="ayesha@gmail.com"
                  value={personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                  onBlur={handleEmailBlur}
                />
                {errors.email && <p className="text-[11.5px] text-warn mt-1">{errors.email}</p>}
              </Field>

              <Field label="Phone *" className="flex-1 min-w-[140px]">
                <div className="flex gap-2 w-full min-w-0">
                  <select
                    className={`${inputClass()} flex-none w-[92px] sm:w-[112px] px-1.5 sm:px-2.5`}
                    value={personal.countryCode}
                    onChange={(e) => updatePersonal("countryCode", e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.iso} value={c.dial}>
                        {flagEmoji(c.iso)} {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`${inputClass(errors.phone)} flex-1 min-w-0`}
                    placeholder="3001234567"
                    inputMode="numeric"
                    value={personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    onBlur={handlePhoneBlur}
                  />
                </div>
                {errors.phone && <p className="text-[11.5px] text-warn mt-1">{errors.phone}</p>}
              </Field>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Field label="Location" className="flex-1 min-w-[140px]">
                <input
                  className={inputClass()}
                  placeholder="Karachi, Pakistan"
                  value={personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                />
              </Field>
              <Field label="LinkedIn / Portfolio" className="flex-1 min-w-[140px]">
                <input
                  className={inputClass()}
                  placeholder="linkedin.com/in/ayesha"
                  value={personal.linkedin}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="bg-paper border border-line border-l-4 border-l-[#8B5CF6] rounded-xl p-4 mb-3.5">
            <SectionHeading icon="📝" color="#8B5CF6" bg="#EDE9FE">
              Professional Summary
            </SectionHeading>
            <textarea
              className={`${inputClass()} min-h-[70px] resize-y`}
              placeholder="2-3 lines: who you are, key strengths, what you're aiming for."
              value={personal.summary}
              onChange={(e) => updatePersonal("summary", e.target.value)}
            />
          </div>

          <div className="bg-paper border border-line border-l-4 border-l-[#14B8A6] rounded-xl p-4 mb-3.5">
            <SectionHeading icon="🛠" color="#14B8A6" bg="#CCFBF1">
              Skills
            </SectionHeading>
            <textarea
              className={`${inputClass()} min-h-[60px] resize-y`}
              placeholder="Python, SQL, Excel, Power BI, Machine Learning (comma-separated)"
              value={personal.skills}
              onChange={(e) => updatePersonal("skills", e.target.value)}
            />
            <p className="text-[11.5px] text-muted mt-1">Comma-separated. Use exact keywords from the job description where true.</p>
          </div>

          <ListSection
            title="Experience"
            icon="💼"
            color="#F59E0B"
            bg="#FEF3C7"
            items={experience}
            fields={EXPERIENCE_FIELDS}
            onAdd={expHandlers.add}
            onUpdate={expHandlers.update}
            onRemove={expHandlers.remove}
            emptyText="No experience added yet."
          />
          <ListSection
            title="Education"
            icon="🎓"
            color="#EC4899"
            bg="#FCE7F3"
            items={education}
            fields={EDUCATION_FIELDS}
            onAdd={eduHandlers.add}
            onUpdate={eduHandlers.update}
            onRemove={eduHandlers.remove}
            emptyText="No education added yet."
          />
          <ListSection
            title="Projects"
            icon="🚀"
            color="#6366F1"
            bg="#E0E7FF"
            items={projects}
            fields={PROJECT_FIELDS}
            onAdd={projHandlers.add}
            onUpdate={projHandlers.update}
            onRemove={projHandlers.remove}
            emptyText="No projects added yet."
          />
          <ListSection
            title="Certifications"
            icon="🏅"
            color="#10B981"
            bg="#D1FAE5"
            items={certs}
            fields={CERT_FIELDS}
            onAdd={certHandlers.add}
            onUpdate={certHandlers.update}
            onRemove={certHandlers.remove}
            emptyText="No certifications added yet."
          />
        </div>

        {/* CHECKLIST + DOWNLOADS */}
        <div className="p-4 sm:p-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto order-2">
          <Checklist personal={personal} experience={experience} education={education} projects={projects} />

          <div className="flex flex-col gap-2 mt-4">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="font-display font-semibold text-[13px] rounded-lg py-3 bg-ink text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              ⬇ Download PDF
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadWord}
              className="font-display font-semibold text-[13px] rounded-lg py-3 bg-accent text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              ⬇ Download Word (.docx)
            </button>
          </div>

          <button
            type="button"
            onClick={loadSample}
            className="mt-2.5 w-full border border-line rounded-lg py-2.5 text-[12px] text-muted hover:bg-paper"
          >
            Load sample data
          </button>
        </div>

        {/* PREVIEW */}
        <div className="p-4 sm:p-5 flex justify-center order-3 xl:order-3 col-span-1 lg:col-span-2 xl:col-span-1">
          <Preview personal={personal} experience={experience} education={education} projects={projects} certs={certs} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ icon, color, bg, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] flex-none"
        style={{ background: bg }}
      >
        {icon}
      </span>
      <h2 className="font-display text-[13.5px] uppercase tracking-wider m-0" style={{ color }}>
        {children}
      </h2>
    </div>
  );
}

function Field({ label, className, children }) {
  return (
    <div className={`mb-3 ${className || ""}`}>
      <label className="block text-[12px] font-semibold text-inksoft mb-1">{label}</label>
      {children}
    </div>
  );
}

function inputClass(error) {
  return `w-full border-2 rounded-lg px-3.5 py-3 text-[14.5px] bg-[#FCFCFB] transition-colors focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 focus:bg-white ${
    error ? "border-warn bg-warnsoft" : "border-line"
  }`;
}
