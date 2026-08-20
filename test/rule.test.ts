import { TextlintKernel } from "@textlint/kernel";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import { describe, expect, it } from "vitest";
import { reporter } from "../src/rule.js";
import {
  grade1Kanji,
  grade2Kanji,
  grade3Kanji,
  grade4Kanji,
  grade5Kanji,
  grade6Kanji,
} from "../src/data/index.js";
import type { GradeKanjiOptions } from "../src/types.js";

async function lint(text: string, options: GradeKanjiOptions = {}) {
  const kernel = new TextlintKernel();
  const result = await kernel.lintText(text, {
    ext: ".md",
    plugins: [{ pluginId: "markdown", plugin: markdownPlugin }],
    rules: [{ ruleId: "ja-grade-kanji", rule: reporter, options }],
  });
  return result.messages;
}

describe("ja-grade-kanjiルール", () => {
  it("1年生までの漢字を許可する", async () => {
    expect(await lint("一日は雨です。", { grade: 1 })).toHaveLength(0);
  });

  it("対象学年までを累積して許可する", async () => {
    expect(await lint("一年生は春に植物を見る。", { grade: 3 })).toHaveLength(0);
  });

  it("デフォルトの6年生では全1,026字を許可する", async () => {
    const all = [
      ...grade1Kanji,
      ...grade2Kanji,
      ...grade3Kanji,
      ...grade4Kanji,
      ...grade5Kanji,
      ...grade6Kanji,
    ].join("");
    expect(await lint(all)).toHaveLength(0);
  });

  it("上位学年の漢字を1文字の範囲で報告する", async () => {
    const messages = await lint("植物", { grade: 1 });
    expect(messages).toHaveLength(2);
    expect(messages[0]?.message).toContain("小学3年生");
    expect(messages[0]?.range).toEqual([0, 1]);
    expect(messages[1]?.range).toEqual([1, 2]);
  });

  it("配当表外の漢字を報告する", async () => {
    const [message] = await lint("誰", { grade: 6 });
    expect(message?.message).toBe("「誰」は学年別漢字配当表に含まれていません。");
    expect(message?.range).toEqual([0, 1]);
  });

  it("複数の違反をすべて報告する", async () => {
    expect(await lint("植物を観察して記録する。", { grade: 1 })).toHaveLength(6);
  });

  it("allowの各文字を許可する", async () => {
    expect(await lint("誰", { grade: 1, allow: ["誰"] })).toHaveLength(0);
    expect(await lint("情報", { grade: 1, allow: ["情報"] })).toHaveLength(0);
  });

  it("ignoreで指定されたASTノードの子孫を除外する", async () => {
    expect(await lint("[植物](https://example.com)", { grade: 1, ignore: ["Link"] })).toHaveLength(0);
  });

  it("コードはMarkdown ASTの標準構造に従って対象外になる", async () => {
    expect(await lint("`植物`\n\n```txt\n観察\n```", { grade: 1 })).toHaveLength(0);
  });

  it("補助平面の漢字にはUTF-16の2コード単位の範囲を付ける", async () => {
    const [message] = await lint("𠀀", { grade: 6 });
    expect(message?.range).toEqual([0, 2]);
  });

  it.each([0, 7, 1.5, "3", null])("不正なgrade %jを拒否する", async (grade) => {
    await expect(lint("一", { grade: grade as GradeKanjiOptions["grade"] })).rejects.toThrow(
      'ja-grade-kanji: "grade" must be an integer between 1 and 6.',
    );
  });
});
