import jsPDF from "jspdf";
import { structureText, cleanBulletField, cleanSkillsLine } from "./richtext";

const MARGIN = 48;
const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const INK = [26, 26, 26];
const SOFT = [59, 74, 107];

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

  function measure(text, bold, size) {
    doc.setFont("times", bold ? "bold" : "normal");
    doc.setFontSize(size);
    return doc.getTextWidth(text);
  }

  function writeLine(text, { size = 11, style = "normal", gap = 14, color = INK } = {}) {
    doc.setFont("times", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    lines.forEach((line) => {
      ensureSpace(gap);
      doc.text(line, MARGIN, y);
      y += gap;
    });
  }

  // Word-wraps a set of {text, bold} runs across lines, drawing each word in
  // its correct style — this is how real bold/plain mixing and bullet
  // hanging-indents happen without ever printing raw "**"/"*" characters.
  function writeRunsWrapped(runs, { size = 10.5, gap = 13, indent = 0, bulletPrefix = null, color = INK } = {}) {
    const words = [];
    runs.forEach((r) => {
      r.text
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w) => words.push({ text: w, bold: !!r.bold }));
    });
    if (!words.length) return;

    const spaceWidth = measure(" ", false, size);
    const contentLeft = MARGIN + indent;
    const maxWidth = CONTENT_WIDTH - indent;

    let lineWords = [];
    let lineWidth = 0;
    let firstLine = true;

    function flush() {
      if (!lineWords.length) return;
      ensureSpace(gap);
      if (firstLine && bulletPrefix) {
        doc.setFont("times", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(bulletPrefix, MARGIN, y);
      }
      let cx = contentLeft;
      lineWords.forEach((w) => {
        doc.setFont("times", w.bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(w.text, cx, y);
        cx += measure(w.text, w.bold, size) + spaceWidth;
      });
      y += gap;
      lineWords = [];
      lineWidth = 0;
      firstLine = false;
    }

    words.forEach((w) => {
      const ww = measure(w.text, w.bold, size);
      if (lineWidth + ww > maxWidth && lineWords.length) {
        flush();
      }
      lineWords.push(w);
      lineWidth += ww + spaceWidth;
    });
    flush();
  }

  function writeRichBlocks(raw, opts = {}) {
    const blocks = structureText(raw);
    blocks.forEach((b) => {
      if (b.type === "bullet") {
        writeRunsWrapped(b.runs, { size: opts.size || 10.5, gap: opts.gap || 13, indent: 14, bulletPrefix: "•   " });
      } else if (b.type === "heading") {
        const boldRuns = b.runs.map((r) => ({ ...r, bold: true }));
        writeRunsWrapped(boldRuns, { size: opts.size || 10.5, gap: opts.gap || 13 });
      } else {
        writeRunsWrapped(b.runs, { size: opts.size || 10.5, gap: opts.gap || 13 });
      }
    });
  }

  function writeBulletField(raw, opts = {}) {
    const items = cleanBulletField(raw);
    items.forEach((runs) => {
      writeRunsWrapped(runs, { size: opts.size || 10.5, gap: opts.gap || 13, indent: 14, bulletPrefix: "•   " });
    });
  }

  function sectionHeading(title) {
    ensureSpace(26);
    y += 8;
    doc.setDrawColor(26, 26, 26);
    doc.setLineWidth(1);
    doc.setFont("times", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(26, 26, 26);
    doc.text(title.toUpperCase(), MARGIN, y);
    y += 5;
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 15;
  }

  // Name + title
  writeLine(personal.fullName || "Your Name", { size: 21, style: "bold", gap: 25 });
  if (personal.jobTitle) writeLine(personal.jobTitle, { size: 12.5, style: "italic", gap: 17, color: SOFT });

  const contactLine = [fullPhone(personal), personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  if (contactLine) writeLine(contactLine, { size: 10, gap: 16, color: SOFT });

  if (personal.summary) {
    sectionHeading("Summary");
    writeRichBlocks(personal.summary);
  }

  const skillsLine = cleanSkillsLine(personal.skills);
  if (skillsLine) {
    sectionHeading("Skills");
    writeLine(skillsLine, { size: 10.5, gap: 14 });
  }

  if (experience && experience.length) {
    sectionHeading("Experience");
    experience.forEach((e) => {
      writeLine(`${e.title || ""}   —   ${e.start || ""}`, { size: 11, style: "bold", gap: 14 });
      if (e.company || e.location) {
        writeLine(`${e.company || ""}${e.location ? "  |  " + e.location : ""}`, {
          size: 10,
          style: "italic",
          gap: 13,
          color: SOFT,
        });
      }
      writeBulletField(e.bullets);
      y += 6;
    });
  }

  if (projects && projects.length) {
    sectionHeading("Projects");
    projects.forEach((p) => {
      writeLine(`${p.name || ""}${p.tech ? "   —   " + p.tech : ""}`, {
        size: 11,
        style: "bold",
        gap: 14,
      });
      if (p.description) writeRichBlocks(p.description, { size: 10.5, gap: 13 });
      y += 6;
    });
  }

  if (education && education.length) {
    sectionHeading("Education");
    education.forEach((ed) => {
      writeLine(`${ed.degree || ""}   —   ${ed.year || ""}`, { size: 11, style: "bold", gap: 14 });
      if (ed.institution || ed.gpa) {
        writeLine(`${ed.institution || ""}${ed.gpa ? "  |  " + ed.gpa : ""}`, {
          size: 10,
          style: "italic",
          gap: 13,
          color: SOFT,
        });
      }
      y += 4;
    });
  }

  if (certs && certs.length) {
    sectionHeading("Certifications");
    certs.forEach((c) => {
      writeLine(`${c.name || ""}   —   ${c.year || ""}`, { size: 11, style: "bold", gap: 14 });
      if (c.issuer) writeLine(c.issuer, { size: 10, style: "italic", gap: 13, color: SOFT });
      y += 4;
    });
  }

  const fileName = (personal.fullName || "resume").trim().replace(/\s+/g, "_");
  doc.save(`${fileName}_Resume.pdf`);
}
