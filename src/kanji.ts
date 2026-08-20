import { kanjiByGrade } from "./data/index.js";
import type { ElementaryGrade } from "./types.js";

export const kanjiGradeMap: ReadonlyMap<string, ElementaryGrade> = new Map(
  (Object.entries(kanjiByGrade) as Array<[`${ElementaryGrade}`, readonly string[]]>).flatMap(
    ([grade, kanji]) => kanji.map((character) => [character, Number(grade) as ElementaryGrade] as const),
  ),
);

const unifiedIdeographPattern = /^\p{Unified_Ideograph}$/u;

/** Returns the elementary-school grade in which a kanji is first taught. */
export function getKanjiGrade(character: string): ElementaryGrade | null {
  return kanjiGradeMap.get(character) ?? null;
}

/** Identifies a single CJK unified ideograph, including supplementary-plane characters. */
export function isKanji(character: string): boolean {
  return unifiedIdeographPattern.test(character);
}

/** Builds the cumulative character set allowed at the target grade. */
export function createAllowedKanji(
  targetGrade: ElementaryGrade,
  allow: readonly string[] = [],
): Set<string> {
  const allowed = new Set<string>();

  for (let grade = 1; grade <= targetGrade; grade += 1) {
    for (const character of kanjiByGrade[grade as ElementaryGrade]) {
      allowed.add(character);
    }
  }

  for (const value of allow) {
    for (const character of value) {
      allowed.add(character);
    }
  }

  return allowed;
}

export function isAllowedKanji(character: string, allowedCharacters: ReadonlySet<string>): boolean {
  return !isKanji(character) || allowedCharacters.has(character);
}
