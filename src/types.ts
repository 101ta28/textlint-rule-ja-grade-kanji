export type ElementaryGrade = 1 | 2 | 3 | 4 | 5 | 6;

export interface GradeKanjiOptions {
  /** The highest elementary-school grade whose kanji are allowed. */
  grade?: ElementaryGrade;
  /** Additional characters to allow. Each string is expanded by code point. */
  allow?: string[];
  /** textlint AST container node types whose descendants should be skipped. */
  ignore?: string[];
}
