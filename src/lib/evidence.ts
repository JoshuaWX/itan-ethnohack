export type EvidenceType =
  | "traditional"
  | "laboratory"
  | "animal"
  | "human"
  | "guidance"
  | "unknown";

/** Classify only explicitly curated study metadata; never infer evidence level from a title. */
export function classifyEvidence(studyType: string): EvidenceType {
  const type = studyType.trim().toLowerCase();
  if (type === "traditional use") return "traditional";
  if (type === "in vitro" || type === "laboratory") return "laboratory";
  if (type === "animal") return "animal";
  if (type === "human") return "human";
  if (type === "official guidance") return "guidance";
  return "unknown";
}
