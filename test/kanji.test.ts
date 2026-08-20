import { describe, expect, it } from "vitest";
import { createAllowedKanji, getKanjiGrade, isKanji } from "../src/kanji.js";

describe("漢字判定", () => {
  it("初出学年をMapから逆引きする", () => {
    expect(getKanjiGrade("一")).toBe(1);
    expect(getKanjiGrade("曜")).toBe(2);
    expect(getKanjiGrade("植")).toBe(3);
    expect(getKanjiGrade("誰")).toBeNull();
  });

  it("CJK統合漢字を補助平面も含めて識別する", () => {
    expect(isKanji("漢")).toBe(true);
    expect(isKanji("𠀀")).toBe(true);
    expect(isKanji("々")).toBe(false);
    expect(isKanji("A")).toBe(false);
  });

  it("対象学年までを累積し、allowは文字単位で展開する", () => {
    const allowed = createAllowedKanji(3, ["情報", "AI"]);
    expect(allowed).toContain("一");
    expect(allowed).toContain("曜");
    expect(allowed).toContain("植");
    expect(allowed).not.toContain("観");
    expect(allowed).toContain("情");
    expect(allowed).toContain("報");
  });
});
