// Suggest label text for review, never silently treat it as a confirmed list.
export function extractIngredientSection(text: string): string {
  const match = /\b(?:ingredients|composition)\s*[:\-]\s*([\s\S]*)/i.exec(text);
  if (!match) return "";
  const lines: string[] = [];
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*(?:directions|dosage|warnings?|caution|storage|manufactur\w*|expiry|best before|nafdac|net weight|contact)\b/i.test(line)) break;
    if (!line.trim() && lines.length) break;
    if (line.trim()) lines.push(line.trim());
  }
  return lines.join("\n").slice(0, 4000);
}
