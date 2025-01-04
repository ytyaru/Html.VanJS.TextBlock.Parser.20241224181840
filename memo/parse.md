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


