window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.TextBlock.Parser.20241224181840/`}, 'TextBlock.Parser')),
        p('テキストブロックからHTMLを作成する。'),
//        p('Create HTML from text blocks.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    const bp = new BlockParser()
    const blocks = bp.parse(`
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
# 見出し１

　本文１。
\`\`\`\`
外前
\`\`\`
内
\`\`\`
外後
\`\`\`\`
# 見出し２

　本文２。

--- hr1

　本文２−２。

--- hr2

　本文２−３。
---k1=v1 k2=v2
フェンス➖２
---

`)
    console.log(blocks)
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

