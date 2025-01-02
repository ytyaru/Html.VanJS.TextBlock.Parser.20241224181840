window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    /*
//    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        van.tags.h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.TextBlock.Parser.20241224181840/`}, 'TextBlock.Parser')),
        van.tags.p('テキストブロックからHTMLを作成する。'),
//        p('Create HTML from text blocks.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
    */
    const p = new Parser()
//    const bp = new BlockParser()
//    const blocks = bp.parse(`
//    p.setOption({preprocessor:{text:(text)=>RubyParser.parse(text)}})
//    p.setTextBlockPreprocessor((text)=>RubyParser.parse(text))
    p.textBlockPreprocess = (text)=>RubyParser.parse(text)
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

\`\`\`\`
外前
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

    document.querySelector(`#viewer`).innerHTML = blocks.filter(b=>'htmlBlocks' in b && b.htmlBlocks).map(b=>b.htmlBlocks.join('')).join('')
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

