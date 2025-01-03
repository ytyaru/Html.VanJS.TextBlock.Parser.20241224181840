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
        index: 0, // 原稿全体のうち何番目のブロックか（前回終了時復旧するときや誤字箇所指摘等に使う）
        id: 'xx', // 著者が定めた当ブロックの識別子（{part id-xx}のように参照するとき使う）
        content: {
            index: 0, // 同一型のうち何番目のブロックか
            fence: { 
                sig: '-',
                len: 3,
                text: '---',
                type: 'free', // ---:free, ```:code, ''':annotation, """:quote, @@@:address, +++:part, ===:ui, ~~~:?, ^^^:?
                arg: {
                    ary: [], // [...header.ary, ..footer.ary]
                    obj: {}, // {...header.obj, ..footer.obj}
                },
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
            },
        }
    },
    parse: {
        html: '<p>原稿</>', // 原稿をHTML化したコード
        text: { // 検索・読上用
            full: `ルビの親文字・ルビ文字（読み仮名と義訓）をその順で表記したプレーンテキスト`,
            ruby: { // ルビのルビ文字だけにしたプレーンテキスト
                base: `ルビの親文字だけにしたプレーンテキスト`,
                yomi: `ルビの読み仮名だけにしたプレーンテキスト`,
                gikun: `ルビの義訓だけにしたプレーンテキスト`,
                yomiGikun: `ルビの読み仮名と、あれば義訓を表記したプレーンテキスト`,
            },
        },
        obj: { // yamlをオブジェクト化した値（フロントマター）
            ...
        },
    },
}
```

```
fence: {
    type: 'free',
    sig: {
        char: '-',
        len: 3,
        text: '---',
    },
    arg: {
        ary: [],
        obj: {},
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
    }
        sig: '-',
        len: 3,
        text: '---',
        type: 'free', // ---:free, ```:code, ''':annotation, """:quote, @@@:address, +++:part, ===:ui, ~~~:?, ^^^:?
        arg: {
            ary: [], // [...header.ary, ..footer.ary]
            obj: {}, // {...header.obj, ..footer.obj}
        },
    }
```
```
text: [
    {start:0, end:0, blockIndex:0, text:'...'},
    {start:0, end:0, blockIndex:0, text:'...'},
    ...,
}]
```
```javascript
const Block = {
    script: { // 原稿（簡易構文）
        start: 0,
        end: 0,
        text: '...原稿...',
    }, 
    block: {
        type: 'text', // text/fence のいずれか
        index: 0, // 原稿全体のうち何番目のブロックか（前回終了時復旧するときや誤字箇所指摘等に使う）
        id: 'xx', // 著者が定めた当ブロックの識別子（{part id-xx}のように参照するとき使う）
        content: {
            index: 0, // 同一型のうち何番目のブロックか
        },
    },
    parse: {
        html: '<p data-block-index="0">原稿</p>',
    },
}
```

* text
* fence
    * front-matter
    * part


　テキストの場合は、次のような処理になる。

1. 原稿からフェンスブロック箇所を取得する
2. フェンスブロックの間をテキストウォールとする
3. テキストウォールに一括置換処理（preprocess）をする
4. 3をテキストブロックに分割する（二連続以上改行していたらブロック分割する）
5. テキストブロックをブロックとして追加する
6. 各ブロックをHTML変換する

　一括置換（preprocess）はテキストウォールのみ対象である。フェンスブロックは対象外。なるだけ処理回数を減らすために行う。

