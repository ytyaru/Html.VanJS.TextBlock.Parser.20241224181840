# Parse

　簡易構文（JDoc/Javel(JapaneseDocument/JapaneseNovel)）からHTMLに変換する。

1. text => wall
2. wall => block
3. block => html, element, node, object, array, ...

要素|意味
----|----
`text`|`string`型データ。外部ファイルから読み取った値もありうる。
`wall`|`text`の部分文字列。`block`を一つ以上含む。`fence`/`text`の二種類ある。
`block`|`wall`の全部または部分文字列。変換方法や`text`内のindex等の情報を持っている。

　`block`には二種類ある。

block種別|意味
---------|----
`textBlock`|基本ブロック。自然言語でありHTMLの`<h1>`,`<p>`,`<br>`等に変換するブロック。
`fenceBlock`|拡張ブロック。指定した任意の解析方法に従って内容をパースするブロック。

　`block`は以下のいずれかにパースされる。

要素|意味
----|----
`html`|`body.innerHTML`に代入する文字列
`element`|`body.append()`に与える引数
`node`|`body.append()`に与える引数（`doctype`等`element`以外のノードも含みうる）
`object`|JavaScriptのObject型。YAML,TOMLなどのテキスト形式をパースした結果。
`array`|JavaScriptのObject型。CSV,TSVなどのテキスト形式をパースした結果。

## TextBlock

`type`|HTML
------|----
`injection`|原稿の入力値はHTMLであり、変換せずそのまま出力する（あるいはCSSやJSも）
`space`|スペース、改行、タブなどの空白文字全般（場合によっては`<br>`変換、削除、CSSによる`padding`に変換等する。）
`heading`|`<h1>`〜`<h6>`
`hr`|`<hr>`
`paragraph`|`<p>`
`list`|`<ul>`,`<ol>`,`<li>`

````jdoc
<p>ここにあるHTMLコードをそのまま出力する。</p>
````
```html
<p>ここにあるHTMLコードをそのまま出力する。</p>
```
````jdoc
<<<html
<p>ここにあるHTMLコードをそのまま出力する。</p>
<label>テキスト：<input type="text"></label>
<<<
````
```html
<p>ここにあるHTMLコードをそのまま出力する。</p>
<label>テキスト：<input type="text"></label>
```
```jdoc
<<<css
.some {
  color:red;
}
<<<
```
```html
<style>
.some {
  color:red;
}
</style>
```
```jdoc
<<<js
console.log('A')
<<<
```
```html
<script>
console.log('A')
</script>
```

```js
token = {
  type: 'text.heading',
  type: 'fence.code',
}
```

　インライン要素についてはブロック単位で一括変換する。

### TextBlockInline

`type`|HTML|補足
------|----|----
`hl`,`hyper-link`|`<a>`|外部リンク(HyperLink) `https://`
`al`,`anchor-link`|`<a>`|内部リンク(AnchorLink) `#`
`ruby`|`<ruby>`,`<rt>`,`<rp>`|
`em`|`<em>`|
`mark`|`<mark>`|
`code`|`<code>`|
`kbd`|`<kbd>`|キーボードのキー、メニュー画面のメニュー項目名などユーザが入力する内容全般。
`icon`|`<i class="...">`|アイコン画像（SVG, PNG, ...）

`define`|`<dl>`,`<dt>`,`<dd>`,`<def>`,`<abbr>`

`<area>`
`<article>`
`<aside>`
`<audio>`
`<b>`
`<base>`
`<bdi>`
`<bdo>`
`<body>`
`<button>`
`<canvas>`
`<caption>`
`<cite>`
`<col>`
`<colgroup>`
`<data>`
`<datalist>`
`<del>`
`<details>`
`<summary>`
`<div>`
`<embed>`
`<fencedframe>`
`<fieldset>`
`<figcaption>`
`<figure>`
`<footer>`
`<from>`
`<head>`
`<header>`
`<hgroup>`
`<hr>`
`<html>`
`<i>`
`<iframe>`
`<img>`
`<input>`
`<ins>`
`<label>`
`<legend>`
`<link>`
`<main>`
`<map>`
`<menu>`
`<meta>`
`<meter>`
`<nav>`
`<noscript>`
`<object>`
`<optgroup>`
`<option>`
`<output>`
`<picture>`
`<portal>`
`<progress>`
`<q>`
`<s>`
`<samp>`
`<script>`
`<search>`
`<section>`
`<select>`
`<slot>`
`<small>`
`<source>`
`<span>`
`<strong>`
`<style>`
`<sub>`
`<summary>`
`<sup>`
`<table>`
`<tbody>`
`<td>`
`<template>`
`<textarea>`
`<tfoot>`
`<thead>`
`<time>`
`<title>`
`<tr>`
`<track>`
`<u>`
`<ul>`
`<var>`
`<video>`
`<wbr>`

## FenceBlock

`type`|HTML
------|----
`code`|`<pre><code>`
`quote`|`<blockquote>`

# パース工程

工程|入力|出力
----|----|----
upload/import|ファイル|簡易構文テキスト
edit|簡易構文テキスト|ブロック
parse|簡易構文テキスト|ブロック(Array,Object,Text(簡易構文,HTML))
render|ブロック|`el.innerHTML`/`el.append()`
download/export|HTML|ファイル

データ|形式
------|----
簡易構文|Javel,YAML,...
ブロック|JS-Object(Object,Array,Text(簡易構文,HTML))
ファイル|OSのファイルシステムで扱うファイルのこと。テキスト(Javel,HTML,CSS,JS)、バイナリ(SQLite3,ZIP)形式等を扱う。

https://marked-js-org.translate.goog/using_pro?_x_tr_sl=auto&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=wapp#tokenizer

工程|意味
----|----
Tokenizer|簡易構文をトークンに変換する方法を定義する
Lexer|簡易構文を受け取り、トークナイザー関数を呼び出す
Parser|トークンを受け取り、レンダラー関数を呼び出す
Renderer|トークンのHTML出力を定義する
Hook|処理の途中で任意の処理を差し込む（開始、終了、全トークンに対しその直前）

```js
renderer.heading(token, depth) {return `<h1>${this.parser.parseInline(tokens)}</h1>`}
```

* Block level
	* `space`
	* `code`
	* `blockquote`
	* `html`
	* `heading`
	* `hr`
	* `list`
	* `listitem`
	* `checkbox`
	* `paragraph`
	* `table`
	* `tablerow`
	* `tablecell`
* Inline level
	* `strong`
	* `em`
	* `codespan`
	* `br`
	* `del`
	* `link`
	* `image`
	* `text`

```js
tokenizerr = {
  codespan(src) {
    const match = src.match(/^\$+([^\$\n]+?)\$+/);
    if (match) {
      return {
        type: 'codespan',
        raw: match[0],
        text: match[1].trim()
      };
    }
    return false;
  }
};
```
```js
const tokens = lexer.lex(script, options)
const html = parser.parse(tokens, options)
document.body.innerHTML = html
```

Hook API|意味
--------|----
`preprocess(markdown: string): string`|マークされた人に送信する前にマークダウンを処理します。
`postprocess(html: string): string`|マークされた解析が完了したら HTML を処理します。
`processAllTokens(tokens: Token[]): Token[]`|ウォーク トークンの前にすべてのトークンを処理します。
`provideLexer(): (src: string, options?: MarkedOptions) => Token[]`|マークダウンをトークン化する機能を提供します。
`provideParser(): (tokens: Token[], options?: MarkedOptions) => string`|トークンを解析する機能を提供します。
