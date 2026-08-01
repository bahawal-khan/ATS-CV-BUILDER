import jsPDF from "jspdf";
import { cleanSkills, parseFreeText, cleanBulletLines } from "./textFormat";

const MARGIN = 48;
const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FONT = "times";

function fullPhone(personal) {
  return personal.phone ? `${personal.countryCode} ${personal.phone}` : "";
}

export function exportResumePdf(data) {
  const { personal, experience, education, projects, certs } = data;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  function ensureSpace(lineHeight) {
    if (y + lineHeight > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function writeLine(text, { size = 11.5, style = "normal", gap = 15, color = [26, 26, 26], indent = 0 } = {}) {
    doc.setFont(FONT, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
    lines.forEach((line) => {
      ensureSpace(gap);
      doc.text(line, MARGIN + indent, y);
      y += gap;
    });
  }

  function sectionHeading(title) {
    ensureSpace(26);
    y += 6;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(1);
    doc.setFont(FONT, "bold");
    doc.setFontSize(13);
    doc.setTextColor(26, 26, 26);
    doc.text(title.toUpperCase(), MARGIN, y);
    y += 4;
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 15;
  }

  function writeFreeText(raw, { size = 11.5, gap = 15 } = {}) {
    const parsed = parseFreeText(raw);
    if (parsed.mode === "bullets") {
      parsed.items.forEach((item) => writeLine(`•  ${item}`, { size, gap, indent: 4 }));
    } else if (parsed.text) {
      writeLine(parsed.text, { size, gap });
    }
  }

  // Name + title
  writeLine(personal.fullName || "Your Name", { size: 21, style: "bold", gap: 25 });
  if (personal.jobTitle) writeLine(personal.jobTitle, { size: 12.5, style: "italic", gap: 17 });

  const contactLine = [fullPhone(personal), personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  if (contactLine) writeLine(contactLine, { size: 10.5, gap: 17, color: [60, 60, 60] });

  if (personal.summary) {
    sectionHeading("Summary");
    writeFreeText(personal.summary);
  }

  const skillsClean = cleanSkills(personal.skills);
  if (skillsClean) {
    sectionHeading("Skills");
    writeLine(skillsClean, { size: 11.5, gap: 15 });
  }

  if (experience && experience.length) {
    sectionHeading("Experience");
    experience.forEach((e) => {
      writeLine(`${e.title || ""}   —   ${e.start || ""}`, { size: 12, style: "bold", gap: 15 });
      if (e.company || e.location) {
        writeLine(`${e.company || ""}${e.location ? "  |  " + e.location : ""}`, {
          size: 11,
          style: "italic",
          gap: 14,
          color: [60, 60, 60],
        });
      }
      cleanBulletLines(e.bullets).forEach((b) => writeLine(`•  ${b}`, { size: 11, gap: 14, indent: 4 }));
      y += 6;
    });
  }

  if (projects && projects.length) {
    sectionHeading("Projects");
    projects.forEach((p) => {
      writeLine(`${p.name || ""}${p.tech ? "   —   " + p.tech : ""}`, {
        size: 12,
        style: "bold",
        gap: 15,
      });
      writeFreeText(p.description, { size: 11, gap: 14 });
      y += 6;
    });
  }

  if (education && education.length) {
    sectionHeading("Education");
    education.forEach((ed) => {
      writeLine(`${ed.degree || ""}   —   ${ed.year || ""}`, { size: 12, style: "bold", gap: 15 });
      if (ed.institution || ed.gpa) {
        writeLine(`${ed.institution || ""}${ed.gpa ? "  |  " + ed.gpa : ""}`, {
          size: 11,
          style: "italic",
          gap: 14,
          color: [60, 60, 60],
        });
      }
      y += 4;
    });
  }

  if (certs && certs.length) {
    sectionHeading("Certifications");
    certs.forEach((c) => {
      writeLine(`${c.name || ""}   —   ${c.year || ""}`, { size: 12, style: "bold", gap: 15 });
      if (c.issuer) writeLine(c.issuer, { size: 11, style: "italic", gap: 14, color: [60, 60, 60] });
      y += 4;
    });
  }

  const fileName = (personal.fullName || "resume").trim().replace(/\s+/g, "_");
  doc.save(`${fileName}_Resume.pdf`);
}
