## エラーになる

　私の環境chromium v92では、mermaid.js v11がエラーになる。

　コードをみるとES2022の新機能である[静的初期化ブロック][]構文が使われている箇所でエラーになっている。つまり私のブラウザが古くて実行エラーになり使えない。

* 当該機能だけ追加するポリフィルがほしいが、どうやって作れるか判らない
* 当該コードだけ旧コードで代用したいが、どう書くべきか判らないし、大量すぎる

[静的初期化ブロック]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks

　諦めて旧版を使うしかないが、新しいグラフが使えないのが嫌すぎる。

## [静的初期化ブロック][]

　mermaid v11.4.1 の min コードを`static{`でテキスト検索してみる。すると以下のようなコードが大量にあった。

```js
static{o(this,"UnknownDiagramError")}
```

　無名関数にまで[静的初期化ブロック][]が使われていた。

　問題はこの`o`という関数である。ようするにクラス定義がされた時点で実行するメソッドだ。メソッドなので`static 変数名 = '値';`という変数定義コードに置換することはできない。困った。

　だが、`o`の実装を追うと`R1()`が呼び出されており、その定義をみると`Object.define()`であった。ならばこれを一番外側で呼び出すコードに置換してやればいいのでは？　ただ「各`static`クラスオブジェクトに何らかのプロパティを追加する」というのが厄介な所。

```js
var o=(t,e)=>R1(t,"name",{value:e,configurable:!0});
```
```js
var R1=Object.defineProperty;
```

　つまり`static{o(this,"...")}`なコードは、`Object.defineProperty(this, 'name', {value:'...'})`なコードに置換すればいい。


```js
static{o(this,"UnknownDiagramError")}
```
```js
Object.defineProperty(this, 'name', {value:'UnknownDiagramError', configurable:!0});
```

　ただ、困るのは実行タイミングである。[静的初期化ブロック][]と同じタイミングで実行できる旧機能は存在しない。

* クラス定義より早く定義する（不可能）
* クラス定義より遅く定義する
    * コンストラクタで呼び出す（`new`されるまで定義されない）
    * クラス定義が終わったら呼び出す（もし[静的初期化ブロック][]内で当該定義を参照していたら未定義エラーになる）

　クラス定義が終わったら呼び出す。とりあえず今回はその方法でなんとかなりそう。ただ、無名関数もあったため、かなり面倒くさい対応になる。一個ずつ対処が必要だ。

　たとえば以下のように無名クラス定義を変数`rp`に代入している。

```js
;rp=class extends Error{static{o(this,"UnknownDiagramError")}constructor(e){super(e),this.name="UnknownDiagramError"}}});
```

　上記の文の直後に、以下コードを差し込む。もちろん`static{...}`のコードを削除するのも忘れずに。

```js
o(rp,"UnknownDiagramError");
```

　そうすると以下のコードになる。

```js
;rp=class extends Error{constructor(e){super(e),this.name="UnknownDiagramError"}}});o(rp,"UnknownDiagramError");
```

　こんな感じにコードを修正すると同エラーは解消できるはず。

;FS=class{static{o(this,"Type")}constructor(){this.type=Ri.ALL}get(){return this.type}set(e){if(this.type&&this.type!==e)throw new Error("Cannot change both RGB and HSL channels at the same time");this.type=e}reset(){this.type=Ri.ALL}is(e){return this.type===e}},iz=FS});

static{o(this,"Type")}
;o(FS,"Type");

　どこにどう挿入すべきか。毎回悩む。めちゃむずいバグなしにやりきる自信がまったくない。無謀すぎる。やめよう。

## live editor

* 
* https://github.com/mermaid-js/mermaid-live-editor?tab=readme-ov-file

　[Mermaid live editor[]は[`Object.hasOwn()`][]が存在せずエラー。やはり私のブラウザが古い。そこに存在しない新しいAPIが使用されている。

[Mermaid live editor]:https://mermaid.live/
[`Object.hasOwn()`]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn

```
('hasOwn' in Object) || (Object.hasOwn = Object.call.bind(Object.hasOwnProperty));
```
