# Text Block

```javel
　一連のテキストをブロック単位で分割したい。

　ブロックはHTMLにおけるp要素の単位である。

　分割方法は改行コードである。
　二つ以上連続した改行があると、その前後は別のブロックとして区別する。

　ただし、ブロック内には連続しない改行の存在も許す。
　それはHTMLにおけるbr要素となる。
```
```html
<p>　一連のテキストをブロック単位で分割したい。</p>
<p>　ブロックはHTMLにおけるp要素の単位である。</p>
<p>　分割方法は改行コードである。<br>　二つ以上連続した改行があると、その前後は別のブロックとして区別する。</p>
<p>　ただし、ブロック内には連続しない改行の存在も許す。<br>　それはHTMLにおけるbr要素となる。</p>
```

　また、自動折返位置の指定もしたい。

```javel
テキストブロック内の\
行末に半角スラッシュを\
置いた所を自動折返位置とする。\
```
```html
<p>
<span style="display:inline-block;">テキストブロック内の</span>
<span style="display:inline-block;">行末に半角スラッシュを</span>
<span style="display:inline-block;">置いた所を自動折返位置とする。</span>
</p>
```

HTML|簡易構文
----|--------
`<p>`|二連続以上の改行コード（テキストブロック）
`<br>`|テキストブロック内にある単一改行コード
`<span style="display:inline-block;">`|テキストブロック内にある行末改行コードとその前にあるバックスラッシュ`\`（`/\\$/gm`）

HTML|簡易構文
----|--------
`<h1>`〜`<h6>`|`/^(={1,6}) (.+)$/gm`
`<hr>`|`/^={3,}$/gm`

1. 見出し（最低限。レベル分け）
2. 本文（最低限。内容はそのまま）
3. 日本語用
    * ruby, em
        * 青空文庫、カクヨム形式
        * ブレース形式（簡易HTML的）
    * 組文字
        * 長体:縦長:
        * 平体:横長:
        * 半体
        * 縦半体:縦が半分
        * 横半体:横が半分
        * 全半体:縦横半分
        * inline-half: 書字方向が半分
        * block-half: 改行方向が半分
        * half: 全方向が半分
        * half-table: 全方向が半分であり二行分ある領域
            * 3.14が縦書きの場合、`3.`と`14`を縦中横にする
            * 12.345が横書きの場合、`12`と`.345`に分けて小数点以下は
                * `inline-half`にする
                * `half`にして上下の`.3`と`45`の二段に分ける
    * 割注

# Jadoc表記

　TextBlockは前後少なくとも一方に二つ以上連続した改行コードで区切られる。

jadoc|html
-----|----
`\n\n# 任意文字列\n\n`|`<h1>任意文字列</h1>`
`\n\n任意文字列\n\n`|`<p>任意文字列</p>`

## TextBlock

jadoc|html|補足
-----|----|----
`# 任意文字列`|`<h1>任意文字列</h1>`|見出し
`## 任意文字列`|`<h2>任意文字列</h2>`|見出し
`### 任意文字列`|`<h3>任意文字列</h3>`|見出し
`#### 任意文字列`|`<h4>任意文字列</h4>`|見出し
`##### 任意文字列`|`<h5>任意文字列</h5>`|見出し
`###### 任意文字列`|`<h6>任意文字列</h6>`|見出し
`#{1,6} 任意文字列`|`<a id="{所定方法}"></a>`|Anchor。アンカー。toc(Table of Content,目次)の移動先になる
`#{1,6} 任意文字列`|`<hgroup></hgroup>`|見出しグループ。一つの`<h1>`〜`<h6>`と、一つ以上の`<p>`(副題、タグ等)を含む。
`{toc}`|Table Of Contents. 目次。
`---`|`<hr>`|水平線
`任意文字列`|`<p>任意文字列</p>`|段落（意味段落）

　上記`jadoc`はすべて前後少なくとも一方に二つ以上連続した改行コードで区切られる。

## TextBlock Inline(heading/paragrap)

jadoc|html
-----|----
`任意\n文字列`|`<p>任意<br>文字列</p>`|改行（意味段落内における形式段落）
`{wbr 任意 文字列《もじれつ》}`|`<p><span style="display:inline-block;">任意</span><span style="display:inline-block;"><ruby>文字列<rt>もじれつ</rt></ruby></span></p>`
`{# some-id}`|`<a href="#some-id">{定義済み内容}</a>`|AnchorLink。定義はフェンス内で行う。```` ```url``` ````。URLでも`#`で指定する
`{~ prefix textStart textEnd suffix 表示するテキスト}`|`<a href="#:~:text=[prefix-,]textStart[,textEnd][,-suffix]">`
`{a some-id}`|`<a href="#some-id" target="_blank" rel="noopener noreferrer">{定義済み内容}</a>`|HyperLink。外部サイト参照。
`{dfn some-id}`|`<dfn>{定義済み内容}</dfn>`|専門用語を示す。その略語、正式名称、ルビ(読み,義訓)、説明、リンク先等を持てる。
`{* 対象テキスト 注釈テキスト}`|注釈。どう表示するか課題（割注、脚注、後注、ポップアップ、外部リンク等多様な手段がある）
`{* ID}`|注釈。定義した内容を表示する
`{address some-id}`|著者などの連絡先を示す。通称、正式名称、略称、愛称、電話番号、メアド、WEBサービスアカウント等を持てる。
`{audio some-id}`|音楽再生UI。ファイルパス、アーティスト名、アルバム名、公開日等を持てる。
`{video some-id}`|動画再生UI。ファイルパス、名前（作品、監督、演者等）、公開日等を持てる。
`{em 任意テキスト}`|`<em>任意テキスト</em>`強調。
`"任意テキスト"`,`{q some-id}`|`<q>任意テキスト</q>`, `<q cite="https://出典">任意テキスト</q>`
`|漢字《かんじ|KANJI》`,`{ruby 漢字 かんじ KANJI}`|`<ruby style="ruby-position:under;"><ruby>漢字<rt>かんじ</rt></ruby><rt>KANJI</rt></ruby>`

`{dfn some-id}`|`<dl>`,`<dt>`,`<dd>`,`<def>`,`<abbr>`
`{img some-id}`|`<img src="" alt="" loading="lazy" srcset="S.png 320w,M.png 640w,L.png 1280w" sizes="(max-width:1280px) 100vw, 1280px">`,`<picture><source media="" srcset="" sizes=""><img src=""></picture>`

`{ins 任意テキスト}`|`<ins>`
`{del 任意テキスト}`|`<del>`
`{kbd 任意テキスト}`|`<kbd>`
`{mark 任意テキスト}`|`<mark>`
`{small 任意テキスト}`|`<small>`, 著作権表記`© 2025 ytyaru`, `CC-0`, `MIT License`
`{copyright}`|`<small>© 公開年 著者名<small>`（公開年と著者名は外部で定義する）
`{license}`|`<small>ライセンス名かアイコン 公開年 著者名<small>`（公開年と著者名は外部で定義する）

`{strong 任意テキスト}`|`<strong>`
`_任意テキスト_`,`{sub 任意テキスト}`|`<sub>`（下付き文字）
`^任意テキスト^`,`{sup 任意テキスト}`|`<sup>`（上付き文字）
`{var 任意テキスト}`|`<var>`(プログラムコードの変数名を示す。`<code>`内にある変数に対して使う必要あるか？外部なら`<code>`で十分？)

ハイパーリンク|Hyper Link|外部参照。
アンカーリンク|Anchor Link|内部参照。
ダイナミックリンク|Dynamic Link|動的URL。
パーマリンク|Permanent Link|各ページに与えられたURL。一度定義すると変更不可である恒久的URL。
スラッグ|パーマリンク用識別子（パーマリンクの最後を表す固有文字列）
URLクエリ|`https://domain.com/path/index.html?query=value&some=1`
アンカー|`https://domain.com/path/index.html#anchor-1`
テキストフラグメント|`https://example.com#:~:text=[prefix-,]textStart[,textEnd][,-suffix]`


短縮URL|`https://xxxx`

　URLで最重要は一意性である。これを管理するためなら機械可読性が高く人間可読性の低い番号や意味不明な字の羅列であろうと妥協したほうが良い。もし人間可読性を優先して英単語の羅列などにすると重複管理が大変な上に、字数が肥大化してしまうし、やがて重複することは目に見えている。特にブログなど明確に分離できていないか、未来に対する重複の可能性を否定できない場合、機械的に重複しない識別子を自動生成させたほうが得策である。それをパーマリンクとすべきだ。記事へのアクセシビリティに関しては検索URLを用意してキーワードなどで行うべきである。ユーザは最短でも二段階の処理を要するため手間であるのが難点。だが人間可読性があろうと長過ぎるURLはどのみち直接作成困難であろう。

ローカルで管理する自分だけのサイト管理アプリ『リンクリスト』作りました
https://qiita.com/suo-takefumi/items/81734ddca67065aaaf8f

`{figure some-id}`|`<figure>`,`<figcaption>`|文書の本文の流れから参照されるものの、本文の流れに影響を与えることなく、文書のほかの部分や付録に移動することが可能なもの（画像、イラスト、グラフ、コードの断片など）

* UI系
    * `<button>`
    * `<canvas>`
    * `<datalist>`
    * `<dialog>`
    * `<fieldset>`,`<legend>`
    * `<form>`
    * `<input>`
    * `<label>`
    * `<map>`
    * `<meter>`
    * `<option>`
    * `<optgroup>`
    * `<output>`
    * `<progress>`
    * `<select>`
    * `<textarea>`
* Section系
    * `<area>`
    * `<article>`
    * `<aside>`
    * `<body>`
    * `<div>`
    * `<footer>`
    * `<head>`
    * `<header>`
    * `<html>`
    * `<main>`
    * `<menu>`
    * `<nav>`
    * `<noscript>`
    * `<script>`
    * `<search>`
    * `<section>`
* CSS系
    * `<b>`
    * `<col>`
    * `<colgroup>`
    * `<i>`
    * `<s>`
    * `<span>`
    * `<style>`
    * `<u>`
    * `<wbr>`(<span style="display:inline-block;">で代用する。これは中にタグが使われててもOKだが<wbr>はタグが使われてると機能せず)
* テンプレート
    * `<slot>`
    * `<template>`
* メタ系
    * 機械可読
        * `<data>`
        * `<time>`
        * `<meta>`
* Object系(外部プラグイン)
    * `<embed>`
    * `<fencedframe>`
    * `<iframe>`
    * `<object>`
    * `<portal>`
    * `<source>`（`auido`,`picture`,`video`）
    * `<track>`
* 対象外
    * `<base>`
    * `<bdi>`
    * `<bdo>`
    * `<title>`

　上記`jadoc`はすべて前後少なくとも一方に二つ以上連続した改行コードで区切られた見出し`<h1>`〜`<h6>`か段落`<p>`の中に含まれる。

## 見出し

* `<title>`
* `<hgroup>`
    * `<h1>`〜`<h6>`
    * `<p>`

HTML|意味
----|----
`<title>`|ファイル全体の表題（キャッチコピーも含む場合がある）
`<h1>`|ファイル全体の表題（キャッチコピーも含む場合がある）
`<h2>`|見出し（部（編））
`<h3>`|見出し（章）
`<h4>`|見出し（節）
`<h5>`|見出し（項）
`<h6>`|見出し（目）




