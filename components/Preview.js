"use client";

import { structureText, cleanBulletField, cleanSkillsLine } from "@/lib/richtext";

function Runs({ runs }) {
  return (
    <>
      {runs.map((r, i) => (
        <span key={i} style={r.bold ? { fontWeight: 700 } : undefined}>
          {r.text}
          {i < runs.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function RichText({ text }) {
  const blocks = structureText(text);
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "bullet") {
          return (
            <ul key={i} className="ml-[18px] mt-1 mb-1 list-disc">
              <li className="mb-0.5">
                <Runs runs={b.runs} />
              </li>
            </ul>
          );
        }
        if (b.type === "heading") {
          return (
            <div key={i} className="font-bold mt-1.5 mb-0.5">
              <Runs runs={b.runs} />
            </div>
          );
        }
        return (
          <div key={i} className="mb-1">
            <Runs runs={b.runs} />
          </div>
        );
      })}
    </>
  );
}

function BulletField({ text }) {
  const items = cleanBulletField(text);
  if (!items.length) return null;
  return (
    <ul className="ml-[18px] mt-1 list-disc">
      {items.map((runs, i) => (
        <li key={i} className="mb-0.5">
          <Runs runs={runs} />
        </li>
      ))}
    </ul>
  );
}

export default function Preview({ personal, experience, education, projects, certs }) {
  const fullPhone = personal.phone ? `${personal.countryCode} ${personal.phone}` : "";
  const contactLine = [fullPhone, personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  const skillsLine = cleanSkillsLine(personal.skills);

  return (
    <div
      id="resume-preview"
      className="bg-white w-full max-w-[640px] min-h-[800px] shadow-[0_8px_30px_rgba(20,33,61,0.12)] ring-1 ring-black/5 rounded-lg px-6 py-8 sm:px-10 sm:py-10 transition-shadow duration-300"
      style={{ fontFamily: '"Times New Roman", Times, serif', color: "#1a1a1a", fontSize: 13.5, lineHeight: 1.55 }}
    >
      <div className="text-[23px] font-bold mb-0.5 break-words">{personal.fullName || "Your Name"}</div>
      {personal.jobTitle && <div className="text-[14px] text-[#3B4A6B] mb-2">{personal.jobTitle}</div>}
      {contactLine && <div className="text-[11.5px] text-[#3B4A6B] mb-4 break-words">{contactLine}</div>}

      {personal.summary && (
        <Section title="Summary">
          <RichText text={personal.summary} />
        </Section>
      )}

      {skillsLine && (
        <Section title="Skills">
          <div>{skillsLine}</div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e) => (
            <Entry key={e.id} head={e.title} headRight={e.start} sub={e.company} subRight={e.location}>
              <BulletField text={e.bullets} />
            </Entry>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <Entry key={p.id} head={p.name} headRight={p.tech}>
              {p.description && <RichText text={p.description} />}
            </Entry>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((ed) => (
            <Entry key={ed.id} head={ed.degree} headRight={ed.year} sub={ed.institution} subRight={ed.gpa} />
          ))}
        </Section>
      )}

      {certs.length > 0 && (
        <Section title="Certifications">
          {certs.map((c) => (
            <Entry key={c.id} head={c.name} headRight={c.year} sub={c.issuer} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-[12.5px] uppercase tracking-wide border-b-[1.5px] border-[#1a1a1a] pb-1 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Entry({ head, headRight, sub, subRight, children }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between flex-wrap gap-1 font-bold text-[13.5px]">
        <span>{head}</span>
        <span>{headRight}</span>
      </div>
      {(sub || subRight) && (
        <div className="flex justify-between flex-wrap gap-1 italic text-[12px] text-[#3B4A6B] mb-0.5">
          <span>{sub}</span>
          <span>{subRight}</span>
        </div>
      )}
      {children}
    </div>
  );
}
