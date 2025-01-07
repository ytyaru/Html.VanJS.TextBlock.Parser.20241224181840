# Highlight.js language 動的読込

　[Highlight.js][]は構文ハイライターである。

　コードのハイライトには、プログラミング言語ごとに異なる構文にあわせる必要がある。そのため各言語毎にJSライブラリをインポートせねばならない。ES6で`import`構文を使えば可能だが、ES5以下で`<script>`要素を使いインポートしたい場合もある。そこで、そのためのライブラリを作った。

## [hljs download][]

　必要なライブラリを入手する。

1. [hljs download][]にアクセスする
3. すべての言語をもつ状態でダウンロードする(`all-lang`)
2. 何の言語も持たない状態でダウンロードする(`no-lang`)
4. 何の言語も持たない状態の`highlight.min.js`を`<script>`で読み込む

```html
<script src="no-lang/highlight.min.js"></script>
```

## HljsLangLoader

　任意の言語を動的ロードする。

```js
const hljsLL = new HljsLangLoader('all-lang/languages')
hljsLL.add('bash', 'css', 'javascript', 'json', 'markdown', 'typescript', 'xml')
hljsLL.load()
```

1. 言語毎のJSライブラリがあるパスを指定する
2. インポートしたい言語を指定する
3. すべて読込完了後にハイライト処理する（`hljs.highlightElement(el)`）

[Highlight.js]:https://github.com/highlightjs/highlight.js
[hljs download]:https://highlightjs.org/download

## 意義

　高速になる。必要最小限のインポートで済むため。

* 何の言語も持たない状態だとハイライトしたい言語がハイライトできない
* すべての言語も持つ状態だと動作が遅い

　上記の中間を実現したい。つまり、ハイライトしたい言語を指定し、そのライブラリだけを取得したい。



