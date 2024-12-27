# options


```js
parser.setOption({
  preprocess: { // 各フェンスやテキストに対して一括置換などを施す
    fence: null, // フェンスブロック対象となる一連のテキストを返す
    text: (text)=>RubyParser.parse(text), // テキストブロック対象となる一連のテキストを返す
  },
  parser: {
    frontMatter: null,
    fence: null,
    text: new MyTextBlockParser(), // テキストブロック毎に処理を施す `parser.parse(block)`
    text: (block, blockIndex)=>blockIndex+1, // 
  }
})
```

