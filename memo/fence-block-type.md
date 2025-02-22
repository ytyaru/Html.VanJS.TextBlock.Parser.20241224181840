# Fence Block Type

　フェンスブロックは次のように示す。

````javel
---
---
````

* フェンスブロックは開始記号と終了記号がある
    * 開始記号
        * 行頭に同じ記号が3つ以上連続する
    * 終了記号
        * それと同じものが後ろの行のどこかに存在する
    * 引数
        * 開始記号や終了記号には、その後に任意で引数を追加できる
* 開始記号と終了記号の間にあるテキストがフェンスブロックの内容である

　尚、連続する記号の種類によって、ブロックの種類を区別できることとする。

記号|種別ID|意味
----|------|----
`---`|`free`|よく使う一般的なフェンス記号。様々な用途に用いる。
`+++`|`part`|部品を表記する。`{part id-0}`のようにして内容をその箇所に挿入する。
`` ``` ``|`code`|ソースコードを表記する。`<pre><code>`。
`'''`|`annotation`|注釈を表記する。
`"""`|`quote`|引用を表記する。
`@@@`|`address`|連絡先を表記する。`<address>`
`===`|`ui`|UIを表記する。
`...`|``|補足を表記する。
`;;;`|`define`|用語の定義を表記する。`<dl>`,`<dt>`,`<dd>`,`<def>`,`<abbr>`
`///`|`url`|外部リンク。HyperLink。`{url id-0}`, `{https://... 任意テキスト}`
`\\\`|`anchor`|内部リンク。AnchorLink。`{a id-0}`, `{a /dir/path/some.html}` `{/dir/path/some.html#head1?q1=v1&q2=v2 任意テキスト}`
``|`copyright`|`© 2025 AuthorName` `{copylight}`
``|`license`|`CC0`, `MIT`, `AGPLv3`, ... `{license}`
``|`layout`|GridLayout, FlowLayout, ...
``|`env`|開発環境、実行環境、要求スペック
``|`playground`|ソースコードの実行＆結果表示＆ログ出力
`~~~`|``|
`^^^`|``|
`???`|``|
`!!!`|``|
`>>>`|``|
`<<<`|``|
`///`|``|
`\\\`|``|
`|||`|``|
`___`|``|
`***`|``|
`,,,`|``|
`:::`|``|

type: 'free', // ---:free, ```:code, ''':annotation, """:quote, @@@:address, +++:part, ===:ui, ~~~:?, ^^^:?
