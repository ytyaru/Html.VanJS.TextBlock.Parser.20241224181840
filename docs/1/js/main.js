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
    const blocks = p.parse(`
---
フロントマター
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

`)
    console.log(blocks)

    document.querySelector(`#viewer`).innerHTML = blocks.filter(b=>'htmlBlocks' in b).map(b=>b.htmlBlocks.join('')).join('')
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

