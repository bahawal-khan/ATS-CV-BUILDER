import { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { structureText, cleanBulletField, cleanSkillsLine } from "./richtext";

const FONT = "Times New Roman";

function fullPhone(personal) {
  return personal.phone ? `${personal.countryCode} ${personal.phone}` : "";
}

function runsToTextRuns(runs, opts = {}) {
  if (!runs.length) return [new TextRun({ text: "", font: FONT, size: opts.size || 22 })];
  return runs.map(
    (r) =>
      new TextRun({
        text: r.text + " ",
        bold: r.bold || !!opts.bold,
        italics: !!opts.italics,
        font: FONT,
        size: opts.size || 22,
        color: opts.color,
      })
  );
}

function heading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: 24, color: "1A1A1A" })],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "1A1A1A" },
    },
    spacing: { before: 260, after: 130 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: text || "", bold: !!opts.bold, italics: !!opts.italics, font: FONT, size: opts.size || 22, color: opts.color })],
    spacing: { after: opts.after ?? 90 },
    alignment: opts.align,
  });
}

// Renders a field's free text (Summary / Project description) as clean
// paragraphs and, where the user actually wrote bullets, real bullet points —
// with no stray "*", "#" or "**" characters.
function richParagraphs(raw, opts = {}) {
  const blocks = structureText(raw);
  const paragraphs = [];
  blocks.forEach((b) => {
    if (b.type === "bullet") {
      paragraphs.push(
        new Paragraph({
          children: runsToTextRuns(b.runs, { size: opts.size || 22 }),
          bullet: { level: 0 },
          spacing: { after: 60 },
        })
      );
    } else if (b.type === "heading") {
      paragraphs.push(
        new Paragraph({
          children: runsToTextRuns(b.runs, { size: opts.size || 22, bold: true }),
          spacing: { before: 60, after: 60 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: runsToTextRuns(b.runs, { size: opts.size || 22 }),
          spacing: { after: opts.after ?? 90 },
        })
      );
    }
  });
  return paragraphs;
}

function bulletLines(raw) {
  const items = cleanBulletField(raw);
  return items.map(
    (runs) =>
      new Paragraph({
        children: runsToTextRuns(runs, { size: 21 }),
        bullet: { level: 0 },
        spacing: { after: 50 },
      })
  );
}

export async function exportResumeWord(data) {
  const { personal, experience, education, projects, certs } = data;

  const children = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: personal.fullName || "Your Name", bold: true, font: FONT, size: 34, color: "14213D" })],
      spacing: { after: 40 },
    })
  );

  if (personal.jobTitle) {
    children.push(para(personal.jobTitle, { italics: true, size: 24, after: 80, color: "3B4A6B" }));
  }

  const contactLine = [fullPhone(personal), personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  if (contactLine) children.push(para(contactLine, { size: 20, after: 220, color: "3B4A6B" }));

  if (personal.summary) {
    children.push(heading("Summary"));
    children.push(...richParagraphs(personal.summary));
  }

  const skillsLine = cleanSkillsLine(personal.skills);
  if (skillsLine) {
    children.push(heading("Skills"));
    children.push(para(skillsLine));
  }

  if (experience && experience.length) {
    children.push(heading("Experience"));
    experience.forEach((e) => {
      children.push(para(`${e.title || ""}   —   ${e.start || ""}`, { bold: true }));
      const sub = [e.company, e.location].filter(Boolean).join("  |  ");
      if (sub) children.push(para(sub, { italics: true, size: 20, color: "3B4A6B" }));
      children.push(...bulletLines(e.bullets));
      children.push(para("", { after: 100 }));
    });
  }

  if (projects && projects.length) {
    children.push(heading("Projects"));
    projects.forEach((p) => {
      children.push(para(`${p.name || ""}${p.tech ? "   —   " + p.tech : ""}`, { bold: true }));
      if (p.description) children.push(...richParagraphs(p.description, { size: 21 }));
      children.push(para("", { after: 100 }));
    });
  }

  if (education && education.length) {
    children.push(heading("Education"));
    education.forEach((ed) => {
      children.push(para(`${ed.degree || ""}   —   ${ed.year || ""}`, { bold: true }));
      const sub = [ed.institution, ed.gpa].filter(Boolean).join("  |  ");
      if (sub) children.push(para(sub, { italics: true, size: 20, color: "3B4A6B" }));
    });
  }

  if (certs && certs.length) {
    children.push(heading("Certifications"));
    certs.forEach((c) => {
      children.push(para(`${c.name || ""}   —   ${c.year || ""}`, { bold: true }));
      if (c.issuer) children.push(para(c.issuer, { italics: true, size: 20, color: "3B4A6B" }));
    });
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22 },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const fileName = (personal.fullName || "resume").trim().replace(/\s+/g, "_");
  saveAs(blob, `${fileName}_Resume.docx`);
}
