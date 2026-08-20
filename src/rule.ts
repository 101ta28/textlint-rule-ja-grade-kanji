import type { TextlintRuleReportHandler, TextlintRuleReporter } from "@textlint/types";
import { createAllowedKanji, getKanjiGrade, isAllowedKanji } from "./kanji.js";
import type { ElementaryGrade, GradeKanjiOptions } from "./types.js";

const DEFAULT_GRADE: ElementaryGrade = 6;
const VALID_GRADES: ReadonlySet<number> = new Set([1, 2, 3, 4, 5, 6]);

function parseGrade(value: unknown): ElementaryGrade {
  if (value === undefined) {
    return DEFAULT_GRADE;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || !VALID_GRADES.has(value)) {
    throw new TypeError('ja-grade-kanji: "grade" must be an integer between 1 and 6.');
  }
  return value as ElementaryGrade;
}

function createMessage(character: string, targetGrade: ElementaryGrade): string {
  const learnedGrade = getKanjiGrade(character);
  if (learnedGrade === null) {
    return `「${character}」は学年別漢字配当表に含まれていません。`;
  }
  return `「${character}」は小学${learnedGrade}年生で学習する漢字です。小学${targetGrade}年生までの文章では使用できません。`;
}

export const reporter: TextlintRuleReporter<GradeKanjiOptions> = (context, options = {}) => {
  const { Syntax, RuleError, report, getSource, locator } = context;
  const targetGrade = parseGrade(options.grade);
  const allowedCharacters = createAllowedKanji(targetGrade, options.allow ?? []);
  const ignoredNodeTypes = new Set(options.ignore ?? []);
  let ignoredDepth = 0;

  const handlers: TextlintRuleReportHandler = {
    [Syntax.Str](node) {
      if (ignoredDepth > 0) {
        return;
      }

      const text = getSource(node);
      let utf16Index = 0;
      for (const character of text) {
        if (!isAllowedKanji(character, allowedCharacters)) {
          report(
            node,
            new RuleError(createMessage(character, targetGrade), {
              padding: locator.range([utf16Index, utf16Index + character.length]),
            }),
          );
        }
        utf16Index += character.length;
      }
    },
  };

  for (const nodeType of ignoredNodeTypes) {
    if (nodeType === Syntax.Str || nodeType.endsWith(":exit")) {
      continue;
    }
    handlers[nodeType] = () => {
      ignoredDepth += 1;
    };
    handlers[`${nodeType}:exit`] = () => {
      ignoredDepth = Math.max(0, ignoredDepth - 1);
    };
  }

  return handlers;
};

export default reporter;
