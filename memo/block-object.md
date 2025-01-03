# Block Object

```javascript
const Block = {
    script: { // 原稿（簡易構文）
        start: 0,
        end: 0,
        text: '...原稿...',
    }, 
    block: {
        type: 'text/fence', // text/fence のいずれか
        index: 0, // 原稿全体のうち何番目のブロックか
        content: {
            index: 0, // 同一型のうち何番目のブロックか
            fence: { 
                sig: '-',
                len: 3,
                text: '---',
                type: 'free', // ---:free, ```:code, ''':annotation, """:quote, @@@:address, +++:part, ===:ui, ~~~:?, ^^^:?
            }
            header: {
                start: 0,
                end: 0,
                text: '',
                ary: [],
                obj: {},
            },
            footer: {
                start: 0,
                end: 0,
                text: '',
                ary: [],
                obj: {},
            },
            body: {
                start: 0,
                end: 0,
                text: '',
                ary: [],
                obj: {},
            }
        }
    },
    parse: {
        html: '<p>原稿</>', // 原稿をHTML化したコード
    },
}
```

