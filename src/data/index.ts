import { grade1Kanji } from "./grade1.js";
import { grade2Kanji } from "./grade2.js";
import { grade3Kanji } from "./grade3.js";
import { grade4Kanji } from "./grade4.js";
import { grade5Kanji } from "./grade5.js";
import { grade6Kanji } from "./grade6.js";

export { grade1Kanji, grade2Kanji, grade3Kanji, grade4Kanji, grade5Kanji, grade6Kanji };

export const kanjiByGrade = {
  1: grade1Kanji,
  2: grade2Kanji,
  3: grade3Kanji,
  4: grade4Kanji,
  5: grade5Kanji,
  6: grade6Kanji,
} as const;
