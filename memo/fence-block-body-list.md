# fence-analize

```javel
---type-name
---
```
```javel
+++part-id
+++
```
````javel
```code-type
```
````
```javel
"""
"""authorName=著者名 workName=作品名 season=2期3話 heroName=作中登場人物名 workUrl=作品URL
```

```javel
---type-name optV1 optV2 optV3
フェンス内容。
---
```
```javel
---type-name{k1=v1 
k2=v2 k3=v3
k4=v4}
フェンス内容。
---
```


```javel
= Heading
== Heading
=== Heading
==== Heading
===== Heading
====== Heading
```
```javel hr
===
```
```javel
* ul-li-1
* ul-li-2
```
```javel
1. ol-li-1
2. ol-li-2
```
```javel
A. ol-li-1
B. ol-li-2
```
```javel
ｱ. ol-li-1
ｲ. ol-li-2
```
```javel
i.  ol-li-1
ii. ol-li-2
```

```javel
---list type=i,1,A,*,ｱ,一,...
ol-li-1
ol-li-2
    ol-li-2-1
---
```

## 

1. `---`等のフェンス開始と終端を取得する
2. フェンスのヘッダとボディを取得する
3. 2に応じたHTML生成する

