# syntext

　syntextは一連のテキスト（文字列データ）を解析する。

　syntextは`syntax`と`text`をかけ合わせた造語である。

英語|意味
----|----
`syntax`|構文
`text`|文章（sentenceを含む文書全体）

　`syntext`はテキストをフェンスとブロックの二種類に大別する。

```javascript
const blocks = syntext.parse(text)
for (let block of blocks) {
  block.type // fence / text
  block.meta // 補足情報
  block.body // 内容
}
stx.fences
```
