"use client";

import { cleanSkills, parseFreeText, cleanBulletLines } from "@/lib/textFormat";

export default function Preview({ personal, experience, education, projects, certs }) {
  const fullPhone = personal.phone ? `${personal.countryCode} ${personal.phone}` : "";
  const contactLine = [fullPhone, personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");

  const summaryParsed = parseFreeText(personal.summary);
  const skillsClean = cleanSkills(personal.skills);

  return (
    <div
      id="resume-preview"
      className="bg-white w-full max-w-[640px] min-h-[800px] shadow-[0_2px_18px_rgba(20,33,61,0.08)] px-6 py-8 sm:px-10 sm:py-10"
      style={{ fontFamily: "'Times New Roman', Times, serif", color: "#1a1a1a", fontSize: 14, lineHeight: 1.55 }}
    >
      <div className="text-[24px] font-bold mb-0.5 break-words">{personal.fullName || "Your Name"}</div>
      {personal.jobTitle && <div className="text-[15px] text-[#333] mb-2">{personal.jobTitle}</div>}
      {contactLine && <div className="text-[12px] text-[#333] mb-4 break-words">{contactLine}</div>}

      {personal.summary && (
        <Section title="Summary">
          <FreeText parsed={summaryParsed} />
        </Section>
      )}

      {skillsClean && (
        <Section title="Skills">
          <div>{skillsClean}</div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e) => (
            <Entry
              key={e.id}
              head={e.title}
              headRight={e.start}
              sub={e.company}
              subRight={e.location}
              bullets={cleanBulletLines(e.bullets)}
            />
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <ProjectEntry key={p.id} name={p.name} tech={p.tech} description={p.description} />
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

function FreeText({ parsed }) {
  if (!parsed || (!parsed.text && (!parsed.items || parsed.items.length === 0))) return null;
  if (parsed.mode === "bullets") {
    return (
      <ul className="ml-[18px] list-disc">
        {parsed.items.map((item, i) => (
          <li key={i} className="mb-0.5">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <div>{parsed.text}</div>;
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-[13px] uppercase tracking-wide border-b-[1.5px] border-[#1a1a1a] pb-1 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Entry({ head, headRight, sub, subRight, bullets }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between flex-wrap gap-1 font-bold text-[14px]">
        <span>{head}</span>
        <span>{headRight}</span>
      </div>
      {(sub || subRight) && (
        <div className="flex justify-between flex-wrap gap-1 italic text-[13px] text-[#333] mb-0.5">
          <span>{sub}</span>
          <span>{subRight}</span>
        </div>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="ml-[18px] mt-1 list-disc">
          {bullets.map((b, i) => (
            <li key={i} className="mb-0.5">
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectEntry({ name, tech, description }) {
  const parsed = parseFreeText(description);
  return (
    <div className="mb-2.5">
      <div className="flex justify-between flex-wrap gap-1 font-bold text-[14px]">
        <span>{name}</span>
        <span>{tech}</span>
      </div>
      <FreeText parsed={parsed} />
    </div>
  );
}
