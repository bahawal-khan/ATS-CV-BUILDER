// Cleans up free-text fields so stray markdown (##, *, -, •) typed or pasted
// by the user never leaks into the resume as literal characters.

export function stripBulletMarker(line) {
  return line
    .replace(/^\s*#+\s*/, "") // markdown heading marker
    .replace(/^\s*[-*•]\s*/, "") // bullet marker
    .trim();
}

// Skills are always rendered as one clean, comma-separated line —
// regardless of whether the user typed commas, newlines, or pasted
// a "* Python * SQL * ..." style list.
export function cleanSkills(raw) {
  if (!raw) return "";
  const noHeadings = raw.replace(/^\s*#+.*$/gm, "");
  const normalized = noHeadings.replace(/\n/g, ",").replace(/\*/g, ",").replace(/•/g, ",");
  const items = normalized
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.join(", ");
}

// For free-text areas like Summary or a Project description:
// - if every non-empty line starts with -, *, or •  -> treat as a bullet list
// - if one line has multiple inline "*" separators    -> treat as a bullet list
// - otherwise                                          -> treat as a flowing paragraph
export function parseFreeText(raw) {
  if (!raw || !raw.trim()) return { mode: "paragraph", text: "", items: [] };

  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const bulletRegex = /^[-*•]\s+/;

  if (lines.length > 0 && lines.every((l) => bulletRegex.test(l))) {
    return { mode: "bullets", items: lines.map(stripBulletMarker), text: "" };
  }

  if (lines.length === 1 && (lines[0].match(/\*/g) || []).length >= 2) {
    const items = lines[0]
      .replace(/^\s*#+\s*/, "")
      .split("*")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length > 1) return { mode: "bullets", items, text: "" };
  }

  const cleanedText = lines.map(stripBulletMarker).join(" ").replace(/#+/g, "").trim();
  return { mode: "paragraph", text: cleanedText, items: [] };
}

// For the Experience "bullet points" box, each line is already meant to be
// its own bullet — this just strips any stray markdown marker per line.
export function cleanBulletLines(raw) {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => stripBulletMarker(l))
    .filter(Boolean);
}
