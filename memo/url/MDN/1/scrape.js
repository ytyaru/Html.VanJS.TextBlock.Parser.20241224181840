/*
const baseURL = 'https://developer.mozilla.org/ja/docs/Web/HTML/Element/'
for(let a of document.querySelectorAll(`li a`)) {
    const slug = a.href.split('/').slice(-1)[0];
    const url = baseURL + slug;
    const text = a.textContent;
    console.log(url, slug, text)
}
function scrape(deprecated=false, experimental=false) {
    const baseURL = 'https://developer.mozilla.org/ja/docs/Web/HTML/Element/'
    for(let a of document.querySelectorAll(`li a`)) {
        const slug = a.href.split('/').slice(-1)[0];
        const url = baseURL + slug;
        const text = a.textContent;
        console.log(url, slug, text)
    }
}
*/
function scrape(deprecated=false, experimental=false) {
    const items = []
    const baseURL = 'https://developer.mozilla.org/ja/docs/Web/HTML/Element/'
    for(let li of document.querySelectorAll(`li`)) { // CSS Selector :has() は Chrome v105以降のみ実装されているため後方互換として
        if (!deprecated && li.querySelector(`abbr.icon-deprecated`)) {continue}
        if (!experimental && li.querySelector(`abbr.icon-experimental`)) {continue}
        const item = {}
        if (deprecated && li.querySelector(`abbr.icon-deprecated`)){item.deprecated=true}
        if (experimental && li.querySelector(`abbr.icon-experimental`)){item.experimental=true;console.log('XXXXXXXXXXx')}
        const a = li.querySelector('a')
        item.slug = a.href.split('/').slice(-1)[0];
        //const slug = a.href.split('/').slice(-1)[0];
        const url = baseURL + item.slug;
        //const text = a.textContent;
        item.text  =a.textContent;

//        document.querySelector(`main article h1`); // 見出しを取得する
        items.push(item)
        if ('fencedframe'===item.slug) {
            console.log(li.querySelector('abbr'))
        }
        console.log(url, item.slug, item.text)
    }
    return ({baseURL:baseURL, items:items})
}
function makeFullURL(urlData) { return urlData.items.map(item=>urlData.baseURL + item.slug).join('\n') }
function makeJadoc(urlData) {
    const jadoc = `----url
---base
MDN.HTML	${urlData.baseURL}
---
---slug MDN.HTML <{slug}>
urlData.items.map(item=>item.slug+'\t'+item.title).join('\n')
---
---alias MDN.HTML Heading_Elements
heading	<h1>〜<h6>
/(h[1-6])/	<\\1>
----

{a MDN.HTML a}
{a MDN.HTML h1}
{a MDN.HTML h2}
{a MDN.HTML h3}
{a MDN.HTML h4}
{a MDN.HTML h5}
{a MDN.HTML h6}
{a MDN.HTML heading}
`

}
//const res = scrape();
const res = scrape(true,true);
//const res = scrape(true,false);
//const res = scrape(false,true);
//console.log(res)
//console.log(makeFullURL(res))
//deprecated, experimental
//res.items = res.items.filter(item=>'deprecated' in item)
res.items = res.items.filter(item=>'experimental' in item)
console.log(makeFullURL(res))
