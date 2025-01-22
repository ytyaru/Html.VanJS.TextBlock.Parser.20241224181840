# Text Replacer

　テキストをDRY(重複せず)に書くための圧縮ツール。

　テキスト置換するライブラリ。所定のファイル形式にて置換方法とデータ一覧を定義できる。そのデータから共通テキスト部分を展開した完全テキストを返す。ようするにこのTextReplacerは置換という名前と方法だが、そのじつテキスト圧縮である。複数テキストのうち共通部分があるものをまとめたものである。たとえばURLなどはドメイン名やパスなどが共通していたり、特定の部位だけを引数値で変更したかったり、所定値のいずれかと一致するか判定したかったりする。そうしたものを定義できる。

```javascript
replacer.gets('MDN.HTML', ['_blank']); // <a href="..."></a>...
replacer.get('MDN.HTML', ['heading', '_blank']); // <a href="...">&lt;h1&gt;</a>...
```
```jadoc
{a MDN.HTML h1}
```
```html
<a href="${url(name)}" target="${target}" rel="noopener noreferrer">{text(name)}</a>
```

```replace-file-format
#名前（テキスト置換メソッド識別子）
#変数名	値or${}
#...
#出力メソッド名(引数名リスト)=>出力テキスト
##アイテム列名（TSV）
値1	値2
値3	値4
....
```

1. 出力メソッドは変数に依存している
2. 変数は別の変数に依存している場合がある
3. 変数はアイテム列に依存している
4. アイテム列は任意の固定テキストである
5. 依存関係を算出して循環参照しないことを確認することが必要

```
#MDN.HTML
#baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
#url	${baseURL}${slug}
#text	<${slug}>
#title	${text}: ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
#()=><a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>
#(target='_blank')=><a href="${url}" target="${target}" rel="noopener noreferrer">{text}</a>
#(slug, target='_blank')=><a href="${url(slug)}" target="${target}" rel="noopener noreferrer">{text(slug)}</a>
#slug	summary
a	アンカー
abbr	略語
...
```

```
#MDN.HTML
#baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
#getText(name)	ifel([['heading','Heading_Elements'].some(v=>v===name), '<h1>-<h6>'], [/(h[1-6])/.test(name), `<${match[1]}>`], [true,`<${name}>`])
#getSlug(name)	ifel(()=>items.find(i=>i.slug===name), name, ()=>/(heading|h[1-6])/.test(name), 'Heading_Elements', ()=>{throw new TypeError(`${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータitemsに登録してください。`)}())
#title(name,summary)	{getText(name)}: {summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
#getTitle(name)	{title(name, items.find(item=>item.slug===getSlug(name))?.summary)}
#getUrl(name)	{baseURL}{getSlug(name)}
#get(name, target='_blank')	<a href="{getUrl(name)}" target="{target}" rel="noopener noreferrer">{getText(name)}</a>
#gets(target='_blank')	items.map(item=>this.get('Heading_Elements'===item.slug ? 'heading' : item.slug)).join('\n')
##slug	summary
a	アンカー
abbr	略語
...
Heading_Elements	見出し
...
```
```
#MDN.HTML
#baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
#title(item)	{item.text}: {item.summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
#getText(name)	ifel(['heading'===name, '<h1>-<h6>'], [/(h[1-6])/.test(name), `<${match[1]}>`], [true,`<${name}>`])
#getSlug(name)	ifel([/(heading|h[1-6])/.test(name), 'Heading_Elements'], [name,name])
#getSlug(name)	ifel(()=>items.find(i=>i.slug===name), name, ()=>/(heading|h[1-6])/.test(name), 'Heading_Elements', ()=>{throw new TypeError(`${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータに登録してください。`)}())
#getTitle(name)	{title(items.find(item=>item.slug===getSlug(name)))}
#getUrl(name)	{baseURL}{getSlug(name)}
#get(name, target='_blank')	<a href="{getUrl(name)}" target="{target}" rel="noopener noreferrer">{getText(name)}</a>

#get(target='_blank')	<a href="{url}" target="{target}" rel="noopener noreferrer">{text}</a>
#get(target='_blank')	<a href="${url(slug)}" target="${target}" rel="noopener noreferrer">{text(slug)}</a>
#get(target='_blank')	<a href="${this.url(slug)}" target="${target}" rel="noopener noreferrer">{this.text(slug)}</a>
#get(item, target='_blank')	<a href="${this.url(item.slug)}" target="${target}" rel="noopener noreferrer">{this.text(item.slug)}</a>
#get(slug, target='_blank')	<a href="${this.url(slug)}" target="${target}" rel="noopener noreferrer">{this.text(slug)}</a>
#gets	(target='_blank')=><a href="{url}" target="${target}" rel="noopener noreferrer">{text}</a>
#gets	(target='_blank')=>items.map(item=>`<a href="${url}" target="${target}" rel="noopener noreferrer">{text}</a>`)
#gets	(items, target='_blank')=>items.map(item=>`<a href="${url(item.slug)}" target="${target}" rel="noopener noreferrer">{text(item.slug)}</a>`)
#gets	(items, target='_blank')=>items.map(item=>`<a href="${this.url(item.slug)}" target="${target}" rel="noopener noreferrer">{this.text(item.slug)}</a>`)
#obj	()=>	({baseURL:baseURL, url:url, text:text, title:title, items: items([{slug:slug, summary:summary}])})
##slug	summary
a	アンカー
abbr	略語
...
```
```javascript
class MDN.HTML {
  constructor() {
    this._cols = ['slug', 'summary'];
    this._rows = [
      ['a', 'アンカー'],
      ['abbr', '略語'],
    ];
  }
  get baseURL() {return 'https://developer.mozilla.org/ja/docs/Web/HTML/Element/'}
  url(slug) {return `${this.baseURL}${slug}`}
  text(slug) {return `<${slug}>`}
  title(slug, summary) {return `this.text(slug) ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN`}
  get(slug, target='_blank') {return `<a href="${this.url(slug)}" target="${target}" rel="noopener noreferrer">{this.text(slug)}</a>`}
  #getIdx(colName){return this._cols.findIndex((col)=>col===colName)}
  gets(target='_blank') { return this._rows.map(row=>this.get(row[0])) }
//  gets(target='_blank') { return this._rows.map(row=>this.row[this.#getIdx('slug')]) }
}
```
```javascript
const replacer = new Map();
replacer.set('MDN.HTML', new Function(`class {
  constructor() {
    this._cols = ['slug', 'summary'];
    this._rows = [
      ['a', 'アンカー'],
      ['abbr', '略語'],
    ];
  }
  get baseURL() {return 'https://developer.mozilla.org/ja/docs/Web/HTML/Element/'}
  url(slug) {return `${this.baseURL}${slug}`}
  text(slug) {return `<${slug}>`}
  title(slug, summary) {return `this.text(slug) ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN`}
  get(slug, target='_blank') {return `<a href="${this.url(slug)}" target="${target}" rel="noopener noreferrer">{this.text(slug)}</a>`}
  #getIdx(colName){return this._cols.findIndex((col)=>col===colName)}
  gets(target='_blank') { return this._rows.map(row=>this.get(row[0])) }
}`)())
```
```javascript
class ReplacerDefine {

}
```
replacer


# 

```replace-define
#baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
#text(name)	<${name}>
#title(text,summary)	${text}: ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
```
```javascript
const db = database.get('MDN.HTML')

db.store.baseURL
// {slug:'', summary:''}
db.store.all
db.store.lives
db.store.deprecateds
db.store.experimentals

db.replacer.slug('name') // /(heading|h[1-6])/:'Heading_Elements'
db.replacer.text('name') // 'h1':'<h1>', 'heading':'<h1>-<h6>'
db.replacer.title('name', 'summary')

db.generator.a('name', target='_blank') // <a href="..." rel="...">...</a>
```

1. 対象DBを選択する（セレクト）
2. 対象レコードを選択する（フィルタリング）
3. 任意関数を用意する（リプレイス）
4. 出力結果を生成する（ジェネレート）

　重要な所は以下。

* TSVからJavaScriptのオブジェクト配列を取得できる
* TSVからJavaScriptのメソッドを取得できる

　あとはこれらをどう使うかは利用者次第。基本的には何らかの入力を受け取って、何らかの出力をする。その出力は文字列である。

　これをどのような書式で定義させるか。


```replace-define
MDN.HTML
---generator
html.a	name,target="_blank"	<a href="${replacer.url(name)}" target="${target}" rel="noopener noreferrer" title="${replacer.title(replacer.text(name), items.find((i)=>i.slug===replacer.slug(name))?.summary)}">${replacer.text(name)}</a>

html.a	name,target="_blank"	<a href="{url}" target="${target}" rel="noopener noreferrer" title="${replacer.title({text}, items.find((i)=>i.slug==={slug})?.summary)}">{text}</a>
	url	replacer.url(name)
	text	replacer.text(name)
	slug	replacer.slug(name)

html.a	name,target="_blank"	<a href="{url}" target="${target}" rel="noopener noreferrer" title="${replacer.title({text}, items.find((i)=>i.slug==={slug})?.summary)}">{text}</a>
	[^\$]{([_a-zA-Z][_a-zA-Z0-9]+)}	replacer.{N}(name)

html.a	name,target="_blank"	<a href="{url}" target="${target}" rel="noopener noreferrer" title="${replacer.title({text}, items.find((i)=>i.slug==={slug})?.summary)}">{text}</a>
	braceVarName:N	replacer.{N}(name)

// $が付かない{}に囲まれた文字列はreplacerであると自動判定する。引数になくreplacerにある名前ならそれと判断する。引数の指定がなければ自動付与する
html.a	name,target="_blank"	<a href="{url}" target="${target}" rel="noopener noreferrer" title="{title(text, items.find((i)=>i.slug==={slug})?.summary)}">{text}</a>
---replacer
text	name	<${ifel(()=>items.find(i=>i.slug===name), name, ()=>/heading/.test(name), '<h1>-<h6>', ()=>/(h[1-6])/.exec(name), '<\1>', ()=>throw.undefinedName(name)())}>
title	text,summary	${text}: ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
summary	name	items.find((i)=>i.slug===${replacer.slug(name)})?.summary
url	name	${store.baseURL}${replacer.slug(name)}
slug	name	ifel(()=>store.items.find(i=>i.slug===name), name, ()=>/(heading|h[1-6])/.test(name), 'Heading_Elements', throw.undefinedName(name)})

{msg undefinedName name}
{throw msg('undefinedName',{name)}
{console.error msg('undefinedName',{name)}
---msg
undefinedName	name	`${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータに登録してください。`
---throw
undefinedName	name	TypeError	msg.{id}(name)

()=>{throw new TypeError(`${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータに登録してください。`)}()
---console.error
undefinedName	msg	
---store
baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
```

　`generator`の定義内では同一`replacer`の呼び出しが複数回行われる場合がある。でも実装では一回だけ呼び出したほうがパフォーマンスがよい。なので`${replacer.XXXX(YYY,ZZZ)}`のような重複部分を自動抽出して、一つの変数に代入し、後で使用するようコードを修正したい。これを一意に書き表すにはどうしたらいいか？

　あるいは、あえて重複したまま書いたほうが短く書ける場合がある。特に重複回数が二回ならその可能性が高い。でも、実装では一回だけの呼び出しにしたい。結果が変わらない場合がほとんどだと思われるため問題ないはず。

　今回の`replacer`は`name`から`slug`を生成するのがポイントになる。

```javascript
function replace(name) {
  const slug = ifel(()=>store.all.find(i=>i.slug===name), name, ()=>/(heading|h[1-6])/.test(name), 'Heading_Elements', throw.undefinedName(name)});
  const url = `${store.baseURL}${slug}`;
  const text = `<${ifel(()=>store.all.find(i=>i.slug===name), name, ()=>/heading/.test(name), '<h1>-<h6>', ()=>/(h[1-6])/.exec(name), '<\1>', ()=>throw.undefinedName(name)())}>`;
  const summary = store.all.find((i)=>i.slug===slug)?.summary;
  const msg = {}
  msg.undefinedName = `${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータに登録してください。`
  return {slug:slug, url:url, text:text, summary:summary:, msg:{undefinedName:undefinedName}}
}
const R = replace(name)

${R.slug}
${R.url}
generate で使用する
```

　`replacer`は次のような変数をJS処理することで別の文字列を返す機能である。

* `baseURL`のような固定文字列
* TSV定義されたオブジェクト配列の要素がもつキーの値（固定文字列）
* 関数呼出された時の引数（任意文字列）

　最終的には固定文字列を返す。その計算はJSで実装する。

　どのようなパターンがあるか。

* `store`（固定値(リテラル)だけを使う）
    * `baseURL`のような完全固定値（別の文字列に置換するだけ）
    * TSV定義されたオブジェクト配列を使う
* `replace`（変動値(変数)を使う）
    * 使用データ
        * `store`だけを使う
        * 引数だけを使う
        * `store`と引数の両方を使う
        * 計算によって`store`や引数のどれを使うか決定する
    * 引数を固定値に結合する（引数が文字列なら、単純な文字列結合するだけ）
    * 引数を使って計算する（引数が文字列とは限らず、また計算結果は文字列になり、その実装は`${...}`で行う）
        * 繰り返す
        * 条件分岐する
        * 文字列を返す
            * 置換する
            * 結合する
        * 例外発生する
        * コンソール出力する
* `generate`
    * `replace`定義値と引数値を使って文字列結合する

　`replace`の一項目あたりは一行のメソッドで実行できる内容にせねばならない。そのため`if`文をメソッド化した`ifel()`が必要になる。ここで文字列を返すなり、失敗時は例外やコンソール出力させる。

  return {slug:slug, url:url, text:text, summary:summary:, msg:{undefinedName:undefinedName}}
```
MDN.HTML
---generate
html.a	name,target="_blank"	<a href="{url}" target="${target}" rel="noopener noreferrer" title="{title}">{text}</a>
---replace
	


固定値のみ：key-value, table(オブジェクト配列)
---store
baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
---store-table ITEMS
#slug	summary
#str	str
---store.lives ITEMS
a	アンカー
abbr	略語
...
Heading_Elements	HTML の見出し
...
wbr	改行可能
---store.deprecateds ITEMS+{deprecated:true}
acronym	
big	大きめのテキスト
...
tt	テレタイプテキスト
xmp	
---store.experimentals ITEMS+{experimental:true}
fencedframe	追跡可能な埋込コンテンツ
portal	ポータル
```

```
----store
---kv
baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
---
---column-type-default
str	''
int	0
float	0.0
bln	false
date	''
url	''
---
---column ITEMS
slug	summary
str	str
PK	
---
---column ITEMS    name,type,constraints(PK,FK,QK,NN,CH,DF)
slug	str	PK
summary	str	
---
---column DEPRECATED +ITEM
deprecated	boolean	DF:true
---
---column EXPERIMENTALS +ITEMS
experimental	boolean	DF:true
---
---column DEPRECATED ITEM+{deprecated:true}
---
---column EXPERIMENTALS ITEMS+{experimental:true}
---
---column-lines
DEPRECATED ITEM+{deprecated:true}
EXPERIMENTALS ITEMS+{experimental:true}
---
---row lives ITEMS
a	アンカー
abbr	略語
...
Heading_Elements	HTML の見出し
...
wbr	改行可能
---
---row deprecateds ITEMS+{deprecated:true}
acronym	
big	大きめのテキスト
...
tt	テレタイプテキスト
xmp	
---
---row experimentals ITEMS+{experimental:true}
fencedframe	追跡可能な埋込コンテンツ
portal	ポータル
---
---list
all	[...lives, ...deprecateds, ...experimentals].sort((a,b)=>a.slug < b.slug ? 1 : -1)
---
---filter
search	keyword	store.list.all.filter(item=>['slug','summary'].some(k=>item[k].includes(keyword)))
---
----
```
```
------db MDN.HTML
-----store
----kv
----
----tree
----
----table
---type
---
---column ID
---
---row ID colID
---
---list
---
---filter
---
----
-----
-----replace
ID	引数1,引数2=''	テンプレート文字列定義（storeのIDからデータを取得できる）
-----
----generate
ID	引数1,引数2=''	テンプレート文字列定義（storeのIDからデータを取得できる＆replaceのIDをプレースホルダーとして使える）
-----
------
```
```
store.kv.baseURL
store.column.ITEMS // {slug:'str', summary:'str'}
store.column.DEPRECATED // {slug:'str', summary:'str', deprecated:true}
store.column.EXPERIMENTALS // {slug:'str', summary:'str', experimental:true}
store.row.lives // [{slug:'a', summary:'アンカー'},...]
store.row.deprecateds // [{slug:'a', summary:'アンカー'},...]
store.row.experimentals // [{slug:'a', summary:'アンカー'},...]
store.list.all               // [{slug:'', summary:''}, ...]
store.filter.serach(keyword) // [{slug:'', summary:''}, ...]
```
```
{a MDN.HTML h1}
```

```replace-define
#MDN.HTML
#baseURL	https://developer.mozilla.org/ja/docs/Web/HTML/Element/
#text(name)	<${name}>
#title(text,summary)	${text}: ${summary}要素 - HTML: ハイパーテキストマークアップ言語 | MDN
#url(slug)	${baseURL}${slug}
#getSlug(name)	ifel(()=>this.items.find(i=>i.slug===name), name, ()=>/(heading|h[1-6])/.test(name), 'Heading_Elements', ()=>{throw new TypeError(`${name}は未定義のHTML要素名です。もし仕様に追加された新しい要素なら、その情報をマスターデータに登録してください。`)}())
#items	[...this.lives,....this.deprecateds,...this.experimentals].sort((a,b)=>a.slug < b.slug)
#lives	{}
##slug	summary
##str	str
a	アンカー
abbr	略語
...
Heading_Elements	HTML の見出し
...
wbr	改行可能
#deprecateds	{...items, deprecated:true}
acronym	
big	大きめのテキスト
center	中央揃えテキスト
dir	ディレクトリー
font	
frame	
frameset	
marquee	マーキー
nobr	無改行テキスト要素
noembed	埋め込みフォールバック
noframes	フレームフォールバック
param	オブジェクト引数
plaintext	プレーンテキスト
rb	ルビベース
rtc	ルビテキストコンテナー
strike	
tt	テレタイプテキスト
xmp	
#experimentals	{...items, experimental:true}
fencedframe	追跡可能な埋込コンテンツ
portal	ポータル
```

html-tag-deprecated.tsv
html-tag-experimental.tsv
