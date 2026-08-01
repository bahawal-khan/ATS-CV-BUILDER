import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { cleanSkills, parseFreeText, cleanBulletLines } from "./textFormat";

const FONT = "Times New Roman";

function fullPhone(personal) {
  return personal.phone ? `${personal.countryCode} ${personal.phone}` : "";
}

function heading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: 24 })],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "1A1A1A" },
    },
    spacing: { before: 240, after: 120 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [
      new TextRun({ text: text || "", bold: !!opts.bold, italics: !!opts.italics, font: FONT, size: opts.size || 23 }),
    ],
    spacing: { after: opts.after ?? 80 },
  });
}

function bulletPara(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text: `•  ${text}`, font: FONT, size: opts.size || 22 })],
    spacing: { after: 60 },
    indent: { left: 220 },
  });
}

function freeTextParas(raw, opts = {}) {
  const parsed = parseFreeText(raw);
  if (parsed.mode === "bullets") {
    return parsed.items.map((item) => bulletPara(item, opts));
  }
  if (parsed.text) {
    return [para(parsed.text, opts)];
  }
  return [];
}

export async function exportResumeWord(data) {
  const { personal, experience, education, projects, certs } = data;

  const children = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: personal.fullName || "Your Name", bold: true, font: FONT, size: 42 })],
      spacing: { after: 40 },
    })
  );

  if (personal.jobTitle) {
    children.push(para(personal.jobTitle, { italics: true, size: 26, after: 80 }));
  }

  const contactLine = [fullPhone(personal), personal.email, personal.location, personal.linkedin]
    .filter(Boolean)
    .join("   |   ");
  if (contactLine) children.push(para(contactLine, { size: 21, after: 200 }));

  if (personal.summary) {
    children.push(heading("Summary"));
    children.push(...freeTextParas(personal.summary));
  }

  const skillsClean = cleanSkills(personal.skills);
  if (skillsClean) {
    children.push(heading("Skills"));
    children.push(para(skillsClean));
  }

  if (experience && experience.length) {
    children.push(heading("Experience"));
    experience.forEach((e) => {
      children.push(para(`${e.title || ""}   —   ${e.start || ""}`, { bold: true }));
      const sub = [e.company, e.location].filter(Boolean).join("  |  ");
      if (sub) children.push(para(sub, { italics: true, size: 21 }));
      cleanBulletLines(e.bullets).forEach((b) => children.push(bulletPara(b, { size: 21 })));
      children.push(para("", { after: 100 }));
    });
  }

  if (projects && projects.length) {
    children.push(heading("Projects"));
    projects.forEach((p) => {
      children.push(para(`${p.name || ""}${p.tech ? "   —   " + p.tech : ""}`, { bold: true }));
      children.push(...freeTextParas(p.description, { size: 21 }));
      children.push(para("", { after: 100 }));
    });
  }

  if (education && education.length) {
    children.push(heading("Education"));
    education.forEach((ed) => {
      children.push(para(`${ed.degree || ""}   —   ${ed.year || ""}`, { bold: true }));
      const sub = [ed.institution, ed.gpa].filter(Boolean).join("  |  ");
      if (sub) children.push(para(sub, { italics: true, size: 21 }));
    });
  }

  if (certs && certs.length) {
    children.push(heading("Certifications"));
    certs.forEach((c) => {
      children.push(para(`${c.name || ""}   —   ${c.year || ""}`, { bold: true }));
      if (c.issuer) children.push(para(c.issuer, { italics: true, size: 21 }));
    });
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
    styles: {
      default: {
        document: {
          run: { font: FONT },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const fileName = (personal.fullName || "resume").trim().replace(/\s+/g, "_");
  saveAs(blob, `${fileName}_Resume.docx`);
}
