# textlint-rule-ja-grade-kanji

`textlint-rule-ja-grade-kanji` は、文部科学省「学年別漢字配当表」に基づき、指定した小学校学年までに学習する漢字だけが文章で使われているか確認する textlint ルールです。

小学生向け教材や案内文で、対象読者にとって未習の漢字を1文字ずつ検出できます。

## インストール

textlintを初めて使う場合は、Node.jsの準備から検査結果の読み方まで説明した[はじめての漢字チェック](docs/getting-started.md)を参照してください。
[npmで公開しているパッケージ](https://www.npmjs.com/package/textlint-rule-ja-grade-kanji)は、次のコマンドでインストールできます。

```bash
npm install --save-dev textlint textlint-rule-ja-grade-kanji
```

## 基本設定

`.textlintrc.json` にルールを追加します。

```json
{
  "rules": {
    "ja-grade-kanji": {
      "grade": 3
    }
  }
}
```

`grade: 3` は3年生で初めて習う漢字だけでなく、1〜3年生の配当漢字を累積して許可します。

```text
小学1〜3年配当    OK
小学4〜6年配当    NG
配当表外           NG
```

設定を `"ja-grade-kanji": true` とした場合、`grade` の既定値は6です。小学1〜6年の全1,026字を許可し、それ以外のCJK統合漢字を報告します。

## オプション

### `grade`

検査対象の最高学年を `1`〜`6` の整数で指定します。既定値は `6` です。`0`、`7`、`"3"` などは設定ミスとしてエラーになります。

### `allow`

対象学年外でも例外的に許可する文字列の配列です。各要素はUnicodeコードポイント単位で展開されるため、`"情報"` を指定すると「情」と「報」の両方を許可します。英数字など、漢字判定の対象外の文字を含めても影響しません。

```json
{
  "rules": {
    "ja-grade-kanji": {
      "grade": 3,
      "allow": ["誰", "情報", "AI"]
    }
  }
}
```

### `ignore`

検査しないtextlint ASTコンテナのNode種別を指定します。たとえばリンクの表示テキストを除外するには次のように設定します。

```json
{
  "rules": {
    "ja-grade-kanji": {
      "grade": 3,
      "ignore": ["Link"]
    }
  }
}
```

Markdownのインラインコード（`Code`）とコードブロック（`CodeBlock`）は本文を表す `Str` Nodeではないため、textlint標準ASTの構造上、設定なしでも検査対象になりません。リンク先URLも対象外ですが、リンクの表示テキストは通常の本文として検査します。表示テキストも除外したい場合に `"Link"` を指定してください。`ignore` は利用中のProcessorが生成するNode種別名を受け付けます。

## 報告例

入力が `植物を観察する`、設定が `grade: 2` の場合、問題の漢字ごとに次のようなメッセージを表示します。

```text
「植」は小学3年生で学習する漢字です。小学2年生までの文章では使用できません。
「観」は小学4年生で学習する漢字です。小学2年生までの文章では使用できません。
「察」は小学4年生で学習する漢字です。小学2年生までの文章では使用できません。
```

配当表にない漢字は次のように報告します。

```text
「誰」は学年別漢字配当表に含まれていません。
```

各エラーの範囲は問題の1文字だけです。補助平面のCJK統合漢字についても、JavaScriptのUTF-16インデックスを考慮した正しい範囲を返します。

## JavaScript / TypeScript API

ルール本体はデフォルトエクスポートです。判定ロジックを単体でも利用できるよう、`getKanjiGrade`、`isKanji`、`createAllowedKanji` なども名前付きで公開しています。

```ts
import { getKanjiGrade } from "textlint-rule-ja-grade-kanji";

getKanjiGrade("一"); // 1
getKanjiGrade("植"); // 3
getKanjiGrade("誰"); // null
```

## 開発

```bash
npm install
npm run build
npm test
```

テストでは各学年の字数（80 / 160 / 200 / 202 / 193 / 191）、合計1,026字、学年間の重複がないこと、textlint上の検出結果と位置範囲を検証します。

## データ出典

文字データは、文部科学省の一次資料 [小学校学習指導要領（平成29年告示）](https://www.mext.go.jp/content/20230120-mxt_kyoiku02-100002604_01.pdf) の国語・別表「学年別漢字配当表」に基づきます。字数と改訂内容は [小学校学習指導要領（平成29年告示）解説 国語編](https://www.mext.go.jp/content/20220606-mxt_kyoiku02-100002607_002.pdf) でも照合しています。

## ライセンス

MIT
