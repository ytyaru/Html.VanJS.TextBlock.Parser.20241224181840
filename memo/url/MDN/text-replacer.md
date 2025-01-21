# Text Replacer

　テキストをDRY(重複せず)に書くための圧縮ツール。

　テキスト置換するライブラリ。所定のファイル形式にて置換方法とデータ一覧を定義できる。そのデータから共通テキスト部分を展開した完全テキストを返す。ようするにこのTextReplacerは置換という名前と方法だが、そのじつテキスト圧縮である。複数テキストのうち共通部分があるものをまとめたものである。たとえばURLなどはドメイン名やパスなどが共通していたり、特定の部位だけを引数値で変更したかったり、所定値のいずれかと一致するか判定したかったりする。そうしたものを定義できる。

```
replacer.gets('MDN.HTML', ['_blank']); // <a href="..."></a>...
replacer.get('MDN.HTML', ['heading', '_blank']); // <a href="...">&lt;h1&gt;</a>...
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

