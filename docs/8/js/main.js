window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const p = new Parser()
//    const bp = new BlockParser()
//    const blocks = bp.parse(`
//    p.setOption({preprocessor:{text:(text)=>RubyParser.parse(text)}})
//    p.setTextBlockPreprocessor((text)=>RubyParser.parse(text))
    p.textBlockPreprocess = (text)=>RubyParser.parse(text)
    console.log('XXXXXXXXXXXXXXXXXXX')
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

`)
    console.log(blocks)
//    console.log(p.script)

    document.querySelector(`#viewer`).innerHTML = blocks.filter(b=>'htmlBlocks' in b && b.htmlBlocks).map(b=>b.htmlBlocks.join('')).join('')
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

