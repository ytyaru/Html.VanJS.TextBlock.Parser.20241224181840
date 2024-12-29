# 構造化テキスト書式

略名|全名
----|----
`ssv`(`wsv`)|`Space Split Values`(`White space Split Value`)
`ltsv`|`Labeled Tab Split Values`
`ola`|`One Line Array`
`olo`|`One Line Object`
`mla`|`Multi Line Array`
`mlo`|`Multi Line Object`
`kv`|`Key Value`
`kvs`|`Key Value Set`
`tree`|`Tree`
`triple`|`Triple`

## `ssv`/`wsv`（`Space Split Values`/`White space Split Value`）

　`csv`や`tsv`と類似した二次元配列形式。

　区切り文字は` `と`　`である。半角と全角のスペースのいずれか一種が少なくとも二つ以上あること。

記号|概要
----|----
` `|半角スペース
`　`|全角スペース

```csv
Name,Age,Intro
山田,12,やあ
佐々木田,23,ちわっす
,0,
John,34,Has space value.
```
```tsv
Name	Age	Intro
山田	12	やあ
佐々木田	23	ちわっす
	0	
John	34	Has space value.
```
```wsv
Name      Age  Class
山田      12   やあ
佐々木田  23   ちわっす
          0    
John      34   Has space value.
```

　`wsv`は等幅（モノスペース）で表記することを想定している。列の幅は内部データ最長字数に応じて伸長する。これにてテキストエディタの自動折返しをしない場合において、視覚的に表計算ソフトと同じような表現が可能となる。

　問題点は以下。

* 入力
    * 面倒。全セルの長さを細かく調整せねばならない
* 解析
    * 字種ごとに字幅（Half/Wide）を判断せねばならない

　解析や入力に大変な手間がかかることから、`wsv`形式は構造化テキストではなく、スクロール（非自動折返し）による視覚用のプレーンテキストとして、`csv`や`tsv`などから出力するだけのほうが適しているかも？


## `ltsv`

　`tsv`の値にラベルを付与した形式。以下のような構造である。

```ltsv
name:山田	age:15	class:A
name:鈴木	age:24	class:B
```

　JavaScriptのオブジェクト配列に変換される。以下のように。

```json
[{name:"山田", age:15, class:A},
 {name:"鈴木", age:24, class:B}]
```

　ラベル名が同じなら順不同である。つまり以下の各行はすべて同じ。

```ltsv
name:山田	age:15	class:A
name:山田	class:A	age:15
age:15	name:山田	class:A
age:15	class:A	name:山田
class:A	age:15	name:山田
class:A	name:山田	age:15
```

　要素数が増えたら、配列の位置と順序だけでは、どこにある何が何を意味する値なのか判りにくくなる。そこで要素に名前（ラベル）をつけて、順不同にしたのが`ltsv`である。

　欠点は冗長になってしまうこと。ラベル名が何度も出現するから。

## `ola`（`One Line Array`）

```
one two three
```

* 一行以内に記す
* 半角スペースで要素を区切る

## `olo`（`One Line Object`）

```
key:value1 label:value2
```

* キーと値のセットが複数ある
* キーと値の間は`:`や`=`で区切る
* キーバリューセット間は` `で区切る

## `mla`（`Multi Line Array`）
## `mlo`（`Multi Line Object`）

```
k1:v1 k2:v2
k3:v3 k4:v4
```

* キーと値のセットが複数ある
* キーと値の間は`:`や`=`で区切る
* キーバリューセット間は` `や`\n`で区切る

## `kv`（`Key Value`）

　キーと値のセットである。

```
key:value
```

## `kvs`（`Key Value Set`）

　キーと値のセットが複数ある。

```
k1:v1 k2:v2
```
```
k1:v1
k2:v2
```
```
k1="v1" k2="v2"
```
```
k1:"v1", k2:"v2"
```

## `tree`

````javel
```tree
Root
    Node1
        Node1.1
    Node2
```
````

　木構造を表す。先頭が`+`なら子孫要素は非表示である。タップで開閉切替

````javel
```tree
Root
    +Node1
        Node1.1
    Node2
```
````

* ツリー
* 包含
* パンくず

## `tripe`

````javel
```triple
S	V	O
s1	v1	o1
s1	v2	o2
```
````

　グラフ。無向グラフ。有向グラフ。

