# ローカルで動作するファイルを入手したかったが、できなかった

* `https://esm.sh/shiki@1.24.4`から全ファイルを入手（多すぎて断念。wgetで自動化しようとしたが503エラーで断念）
* `https://github.com/shikijs/shiki`をビルドして入手（ビルド方法不明により断念）
* Node.js、`npm init`, `npm install shiki`でビルドして入手（エラーで断念）










```sh
ROOT="shiki-test"
mkdir "$ROOT"
cd "$ROOT"
npm init
npm install typescript
npm install shiki
```

* `$ROOT`
	* `app.ts`
	* `index.html`

```ts app.ts
import { codeToHtml } from "shiki"

console.log('Hello TypeScript');
const code = "alert('Hello Shiki !!');" // 表示するコード
const html = await codeToHtml(code, {
  lang: "javascript", // 言語を指定
  theme: "github-light" // テーマを指定
})
```
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="./app.ts" defer></script>
    <title>初めてのTypeScript</title>
</head>
<body>    
</body>
</html>
```

```sh
npx tsc app.ts
```

　エラーが出た。以下のように大量の。

```
error TS2468: Cannot find global value 'Promise'.

app.ts:2:2 - error TS2705: An async function or method in ES5 requires the 'Promise' constructor.  Make sure you have a declaration for the 'Promise' constructor or include 'ES2015' in your '--lib' option.

2 (async function () {
   ~~~~~

node_modules/@shikijs/core/dist/index.d.mts:260:120 - error TS2583: Cannot find name 'Set'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2015' or later.

260 declare function splitTokens<T extends Pick<ThemedToken, 'content' | 'offset'>>(tokens: T[][], breakpoints: number[] | Set<number>): T[][];
                                                                                                                           ~~~

node_modules/@shikijs/engine-javascript/dist/index.d.mts:31:13 - error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2015' or later.

31     cache?: Map<string, RegExp | Error> | null;
               ~~~

node_modules/@shikijs/types/dist/index.d.mts:761:5 - error TS1169: A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.

761     [Symbol.dispose]: () => void;
        ~~~~~~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:761:6 - error TS2585: 'Symbol' only refers to a type, but is being used as a value here. Do you need to change your target library? Try changing the 'lib' compiler option to es2015 or later.

761     [Symbol.dispose]: () => void;
         ~~~~~~

node_modules/oniguruma-to-es/types/subclass.d.ts:24:5 - error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.

24     #private;
       ~~~~~~~~


Found 7 errors in 5 files.

Errors  Files
     1  app.ts:2
     1  node_modules/@shikijs/core/dist/index.d.mts:260
     1  node_modules/@shikijs/engine-javascript/dist/index.d.mts:31
     2  node_modules/@shikijs/types/dist/index.d.mts:761
     1  node_modules/oniguruma-to-es/types/subclass.d.ts:24
```

　Promiseがない的なことを言っている。`include 'ES2015' in your '--lib' option.`と書いてある。コマンドオプションにESバージョンを追加すればいいのかな？　どうせならもっと新しいバージョンを指定したい。そこで以下にした。

```sh
npx tsc app.ts --lib ES2022
```

　エラー。`WebAssembly`が無いと怒られる。

```sh
node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:57:50 - error TS2503: Cannot find namespace 'WebAssembly'.

57     (importObject: Record<string, Record<string, WebAssembly.ImportValue>> | undefined): Promise<WebAssemblyInstance>;
                                                    ~~~~~~~~~~~

node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:59:28 - error TS2503: Cannot find namespace 'WebAssembly'.

59 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                              ~~~~~~~~~~~

node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:59:72 - error TS2503: Cannot find namespace 'WebAssembly'.

59 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                                                                          ~~~~~~~~~~~

node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:59:95 - error TS2503: Cannot find namespace 'WebAssembly'.

59 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                                                                                                 ~~~~~~~~~~~

node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:65:43 - error TS2304: Cannot find name 'Response'.

65     data: ArrayBufferView | ArrayBuffer | Response;
                                             ~~~~~~~~

node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:67:110 - error TS2304: Cannot find name 'Response'.

67 type LoadWasmOptionsPlain = OnigurumaLoadOptions | WebAssemblyInstantiator | ArrayBufferView | ArrayBuffer | Response;
                                                                                                                ~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:33:50 - error TS2503: Cannot find namespace 'WebAssembly'.

33     (importObject: Record<string, Record<string, WebAssembly.ImportValue>> | undefined): Promise<WebAssemblyInstance>;
                                                    ~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:35:28 - error TS2503: Cannot find namespace 'WebAssembly'.

35 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                              ~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:35:72 - error TS2503: Cannot find namespace 'WebAssembly'.

35 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                                                                          ~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:35:95 - error TS2503: Cannot find namespace 'WebAssembly'.

35 type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports'];
                                                                                                 ~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:41:43 - error TS2304: Cannot find name 'Response'.

41     data: ArrayBufferView | ArrayBuffer | Response;
                                             ~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:43:110 - error TS2304: Cannot find name 'Response'.

43 type LoadWasmOptionsPlain = OnigurumaLoadOptions | WebAssemblyInstantiator | ArrayBufferView | ArrayBuffer | Response;
                                                                                                                ~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:761:5 - error TS1169: A computed property name in an interface must refer to an expression whose type is a literal type or a 'unique symbol' type.

761     [Symbol.dispose]: () => void;
        ~~~~~~~~~~~~~~~~

node_modules/@shikijs/types/dist/index.d.mts:761:13 - error TS2550: Property 'dispose' does not exist on type 'SymbolConstructor'. Do you need to change your target library? Try changing the 'lib' compiler option to 'esnext' or later.

761     [Symbol.dispose]: () => void;
                ~~~~~~~

node_modules/oniguruma-to-es/types/subclass.d.ts:24:5 - error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.

24     #private;
       ~~~~~~~~


Found 15 errors in 3 files.

Errors  Files
     6  node_modules/@shikijs/engine-oniguruma/dist/chunk-index.d.d.mts:57
     8  node_modules/@shikijs/types/dist/index.d.mts:33
     1  node_modules/oniguruma-to-es/types/subclass.d.ts:24
```

　もうさっぱりわからない。たぶん必要なライブラリが不足しているのだろうが、どうすればそれが見つけられるのか。

