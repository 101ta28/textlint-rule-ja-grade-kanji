import { describe, expect, it } from "vitest";
import {
  grade1Kanji,
  grade2Kanji,
  grade3Kanji,
  grade4Kanji,
  grade5Kanji,
  grade6Kanji,
} from "../src/data/index.js";

describe("学年別漢字データ", () => {
  it("各学年の現行配当字数と一致する", () => {
    expect(grade1Kanji).toHaveLength(80);
    expect(grade2Kanji).toHaveLength(160);
    expect(grade3Kanji).toHaveLength(200);
    expect(grade4Kanji).toHaveLength(202);
    expect(grade5Kanji).toHaveLength(193);
    expect(grade6Kanji).toHaveLength(191);
  });

  it("全1,026字に学年間の重複がない", () => {
    const all = [
      ...grade1Kanji,
      ...grade2Kanji,
      ...grade3Kanji,
      ...grade4Kanji,
      ...grade5Kanji,
      ...grade6Kanji,
    ];
    expect(all).toHaveLength(1_026);
    expect(new Set(all)).toHaveLength(1_026);
  });
});
