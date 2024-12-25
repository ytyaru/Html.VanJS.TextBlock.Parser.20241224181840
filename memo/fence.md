# fence

　簡易構文のテキスト内には「フェンス」と「テキストブロック」の二種類がある。

用語|英語|意味
----|----|----
フェンス|fence|二連続以上の改行コードを含められるコンテンツ。HTMLでソースコードや表など特殊な形式のコンテンツを生成する。
ブロック|block|連続しない改行コードを含められるコンテンツ。HTMLで自然言語の文章を生成する。

　フェンスは以下のような要素を表すのに使う。

* フロントマター
* `<pre>`
* `<pre><code>`
* `<table>`
* `<blockquote>`
* その他複合コンテンツ

## 構文

```
+++
フェンス。
何かしらのテキスト。

二連続以上の改行コードをその内容として含めることができる。
つまりテキストブロックとしてではなく、フェンスの内容になる。
+++
```

　フェンスの開始と終了は特定記号によって示される。

* `+++`
* `---`
* `` ``` ``

　次のような特徴がある。

* `+`,`-`,`` ` ``のいずれかの記号を使う
* 上記の記号をどれか一つ、三連続以上あること
* 開始記号と終端記号は同一であること

````
+++
フェンス内容。
+++

---
フェンス内容。
---

```
フェンス内容。
```
````

　補足情報を付与できる。

* フェンス開始記号の直後に、補足情報を付与できる。

````
```html some.html
<p>フェンス補足情報：配列型</p>
```
```lang="html" name="${name}.html" mark-line=2,7,9-11
<p>フェンス補足情報：オブジェクト型</p>
```
````

　さらにネストするときは、記号の連続数を増やすことで対応できる。親ほど数が多く、子ほど少ない。

``````
````javel
```markdown
# 見出し

　本文。
```
````
``````


