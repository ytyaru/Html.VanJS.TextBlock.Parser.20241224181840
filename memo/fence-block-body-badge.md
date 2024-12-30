# フェンスブロック本文：バッジ

　`[npm|v11.1.4][Build|Passing][[icon]name|msg]`みたいなSVGバッジを生成する。

* https://shields.io/
    * https://www.npmjs.com/package/badge-maker
* https://zenn.dev/kou_pg_0131/articles/badge-generator-introduction
* https://github.com/IagoLast/squire-core?tab=readme-ov-file

## 疑問

　SVGである必要はあるのか？　以下のコメント欄では画像キャッシュされて更新されない問題があるようだ。

　https://zenn.dev/kou_pg_0131/articles/badge-generator-introduction

```html
<div class="badge" data-left="npm" data-right="11.4.1"></div>
```

　HTMLならキャッシュも同一扱いだし、ダークモード対応もできるはず。

