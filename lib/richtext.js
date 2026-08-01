// Cleans up markdown-ish text (from AI-generated content pasted by users) into
// structured blocks: headings, bullets, and paragraphs — with real bold runs
// instead of literal "**", "##", "*" characters showing up in the output.

const REDUNDANT_LABELS = /^(professional\s+)?summary$|^skills?$|^projects?$|^experience$|^education$|^certifications?$/i;

function parseInline(text) {
  const runs = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index), bold: false });
    runs.push({ text: m[1], bold: true });
    last = re.lastIndex;
  }
  if (last < text.length) runs.push({ text: text.slice(last), bold: false });

  return runs
    .map((r) => ({
      bold: r.bold,
      text: r.text
        .replace(/[#*`_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    }))
    .filter((r) => r.text.length > 0);
}

function splitInlineStars(line) {
  return line
    .split(/(?:^|\s)\*(?!\*)(?=\s|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function countInlineStars(line) {
  return (line.match(/(?:^|\s)\*(?!\*)(?=\s|$)/g) || []).length;
}

// Returns an array of blocks: { type: "heading" | "bullet" | "paragraph", runs: [{text, bold}] }
export function structureText(raw) {
  if (!raw || !raw.trim()) return [];

  const rawLines = raw.replace(/\r\n/g, "\n").split("\n");
  const lines = [];

  rawLines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      lines.push("");
      return;
    }

    const headerMatch = line.match(/^#{1,6}\s*(.*)$/);
    if (headerMatch) {
      const remainder = headerMatch[1].trim();
      if (!remainder) return;

      if (countInlineStars(remainder) >= 2) {
        splitInlineStars(remainder).forEach((p) => lines.push("* " + p));
        return;
      }

      const wordCount = remainder.split(/\s+/).filter(Boolean).length;
      if (wordCount <= 8) {
        lines.push("#H#" + remainder);
      } else {
        lines.push(remainder);
      }
      return;
    }

    lines.push(line);
  });

  const blocks = [];
  let paraBuf = [];

  function flushPara() {
    if (paraBuf.length) {
      const runs = parseInline(paraBuf.join(" "));
      if (runs.length) blocks.push({ type: "paragraph", runs });
      paraBuf = [];
    }
  }

  lines.forEach((line) => {
    if (!line) {
      flushPara();
      return;
    }
    if (line.startsWith("#H#")) {
      flushPara();
      const runs = parseInline(line.slice(3));
      if (runs.length) blocks.push({ type: "heading", runs });
      return;
    }
    const bulletMatch = line.match(/^[*\-•]\s+(.*)$/);
    if (bulletMatch) {
      flushPara();
      const runs = parseInline(bulletMatch[1]);
      if (runs.length) blocks.push({ type: "bullet", runs });
      return;
    }
    if (countInlineStars(line) >= 2) {
      flushPara();
      splitInlineStars(line).forEach((p) => {
        const runs = parseInline(p);
        if (runs.length) blocks.push({ type: "bullet", runs });
      });
      return;
    }
    paraBuf.push(line);
  });
  flushPara();

  return stripRedundantLeadingLabel(blocks);
}

function stripRedundantLeadingLabel(blocks) {
  if (!blocks.length) return blocks;
  const first = blocks[0];
  const firstText = first.runs.map((r) => r.text).join(" ").trim();

  if (first.type === "heading" && REDUNDANT_LABELS.test(firstText)) {
    return blocks.slice(1);
  }
  if (first.type === "paragraph" && first.runs.length && first.runs[0].bold && REDUNDANT_LABELS.test(first.runs[0].text.trim())) {
    const rest = first.runs.slice(1);
    if (!rest.length) return blocks.slice(1);
    return [{ type: "paragraph", runs: rest }, ...blocks.slice(1)];
  }
  return blocks;
}

// One clean line of plain text per bullet item — for fields that are meant
// to be "one bullet per line" (e.g. experience bullets).
export function cleanBulletField(raw) {
  if (!raw || !raw.trim()) return [];
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  lines.forEach((rawLine) => {
    let line = rawLine.replace(/^#{1,6}\s*/, "");

    if (countInlineStars(line) >= 2) {
      splitInlineStars(line).forEach((p) => {
        const runs = parseInline(p);
        if (runs.length) items.push(runs);
      });
      return;
    }

    line = line.replace(/^[*\-•]\s+/, "");
    const runs = parseInline(line);
    if (runs.length) items.push(runs);
  });
  return items;
}

// Flattens a field into a single clean comma-separated line — used for
// Skills, which reads best as one dense line rather than 30 stacked bullets.
export function cleanSkillsLine(raw) {
  const blocks = structureText(raw);
  const items = [];
  blocks.forEach((b) => {
    if (b.type === "heading") return;
    const text = b.runs.map((r) => r.text).join("");
    if (!text || REDUNDANT_LABELS.test(text.trim())) return;
    if (b.type === "bullet") {
      items.push(text);
    } else {
      text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => items.push(s));
    }
  });
  return items.filter(Boolean).join(", ");
}

export function runsToPlainText(runs) {
  return runs.map((r) => r.text).join("");
}

export function blocksToPlainText(blocks) {
  return blocks.map((b) => runsToPlainText(b.runs)).join(" ");
}
