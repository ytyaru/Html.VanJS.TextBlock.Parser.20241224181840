window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const p = new Parser()
//    const bp = new BlockParser()
//    const blocks = bp.parse(`
//    p.setOption({preprocessor:{text:(text)=>RubyParser.parse(text)}})
//    p.setTextBlockPreprocessor((text)=>RubyParser.parse(text))
    p.textBlockPreprocess = (text)=>RubyParser.parse(text)
    console.log('XXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXX'.sanitize())
    const blocks = p.parse(`
---
title: 本書《ほんしょ》の表題《ひょうだい》にルビや《《強調》》ができる
catch: キャッチコピーに漢字《かんじ》のルビや《《強調》》ができる
date: 2024-12-24T00:00:00+09:00
---
---html
フェンス➖
---
+++css
フェンス＋
+++
\`\`\`js
フェンス｀
\`\`\`
= 見出し１

　本文１。

　漢字《かんじ》にルビを振《ふ》る。

　《《強調》》する。

　パラグラフ内で一行だけ改行すると
br要素を含めることができる。

　一行目の意味段落
　二行目の意味段落
　上記二行は一つのパラグラフに含まれる。

\`\`\`js
const val = 'my value';
console.log(val);
// 自動折返しを試したいのでめちゃくちゃ長いテキストを書いてみる。果たしてソースコードの表示は、自動折返しすべきか、それともスクロールすべきか。スクロールだと続きが横にあることに気付かない場合がある。自動折返しだとその箇所に改行コードが含まれているのか、それとも自動折返しにより改行コードがないのか、見分けが付かない。いずれにせよ難がある。かといってどちらかを選択できるようにすると統一性がなくなり、余計にわかりにくくなってしまう。どうしたものか。私は自動折返ししたほうが良いと思う。無駄な内容を削り、全文を必ず表示する。この二つが担保されたとき、最高に見やすい内容になるはずだ。
\`\`\`

\`\`\`\`
外
前
\`\`\`
内
\`\`\`
外後
\`\`\`\`
= 見出し２

　本文２。

===

== 見出し2-2

　本文２−２。

===

　本文２−３。
---k1=v1 k2=v2
フェンス➖２
---

= 見出し3

　漢字《かんじ》にルビを振《ふ》る。

　《《強調》》する。

　インライン要素でコードをハイライトしたい場合もある。<code>alert('Hello JS !!');</code>
　インライン要素でコードをハイライトしたい場合もある。<code class="language-javascript">alert('Hello JS !!');</code>
　インライン要素でコードをハイライトしたい場合もある。<code class="language-html"><b>HTML要素</b></code>
　インライン要素でコードをハイライトしたい場合もある。\`alert('Hello JS !!');\`こんな感じ。
　インライン要素でコードをハイライトしたい場合もある。\`<b>HTML要素</b>\`こんな感じ。
　インライン要素でコードをハイライトしたい場合もある。\`\`html <b>HTML要素</b> \`\`こんな感じ。
　インライン要素でコードをハイライトしたい場合もある。\`\`js alert('Hello JS !!'); \`\`こんな感じ。
　インライン要素でコードをハイライトしたい場合もある。\`\`js alert(\`Hello JS !!\`); \`\`こんな感じ。

\`\`\`html
<p>HTMLのコード</p>
\`\`\`

`)
    console.log(blocks)
    console.log(p.script)
    console.log(p.script.slice(0, blocks[0].script.start+1))
    console.log(p.script.slice(blocks[0].script.start, blocks[0].script.end))

    // HTMLパース
    const renderer = new Renderer()
    renderer.render(blocks, document.querySelector(`#viewer`))
//    document.querySelector(`#viewer`).innerHTML = blocks.filter(b=>'html' in b.parse).reduce((html, b)=>html+=b.parse.html, '')
//    hljs.highlightAll() // highlight.jsの実行
//    document.querySelector(`#viewer`).innerHTML = blocks.filter(b=>'htmlBlocks' in b && b.htmlBlocks).map(b=>b.htmlBlocks.join('')).join('')
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

