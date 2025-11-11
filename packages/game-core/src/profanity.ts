import { fuzzy } from "fast-fuzzy";

const BASE_WORDS = [
  "idiot",
  "stupid",
  "dumb",
  "hell",
  "crap",
  "shit",
  "fuck"
];

const normalized = BASE_WORDS.map((word) => word.toLowerCase());

export interface ProfanityResult {
  clean: boolean;
  score: number;
  matches: string[];
}

export function sanitizeMessage(message: string): { cleanText: string; flagged: ProfanityResult } {
  const tokens = message.split(/\s+/).filter(Boolean);
  const matches: string[] = [];
  let score = 0;

  for (const token of tokens) {
    const lower = token.toLowerCase();
    for (const bad of normalized) {
      const ratio = fuzzy(lower, bad);
      if (ratio > 0.75) {
        matches.push(token);
        score += ratio;
        break;
      }
    }
  }

  return {
    cleanText: tokens
      .map((token) => (matches.includes(token) ? "***" : token))
      .join(" "),
    flagged: {
      clean: matches.length === 0,
      score,
      matches
    }
  };
}
