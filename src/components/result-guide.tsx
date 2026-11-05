import type { ReactNode } from "react";

export function ResultGuide({ found, meaning, unknown, children }: {
  found: ReactNode;
  meaning: ReactNode;
  unknown: ReactNode;
  children: ReactNode;
}) {
  return <div className="result-guide">
    <dl>
      <div><dt>What we found</dt><dd>{found}</dd></div>
      <div><dt>What this means</dt><dd>{meaning}</dd></div>
      <div><dt>What we could not establish</dt><dd>{unknown}</dd></div>
    </dl>
    <div className="result-next"><strong>Your next step</strong><div>{children}</div></div>
  </div>;
}
