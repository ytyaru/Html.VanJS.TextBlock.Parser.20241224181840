;(function(){
class UrlFenceParser {
    static parse(block) {
        return ('fence' in block && block.fence.ary && 'url'===block.fence.ary[0])
            ? ({base:UrlBase.read(block), items:UrlItem.read(block)})
            : null
    }
}
class UrlBase {
    static read(block) {
        if ('fence' in block && block.fence.ary && 'url'===block.fence.ary[0]) {
            const obj = {}
            const params = block.fence.ary.slice(1)
            if (0 < params.length) obj.id = params[0]
            if (1 < params.length) obj.url = params[1]
            return obj;
        } else {return null}
    }
}
class UrlItem {
    static read(block) {
        for (let line of block.body.split('\n')) {
            const values = line.split('\t')
            if (this.#isQuote(vs[0])) {throw new TypeError(`先頭項目に'や"は使えません。`)}
            if (0===values.length) {return this.#one(values)}
            else if (1===values.length) {return this.#two(values)}
            else if (2===values.length) {return this.#three(values)}
            else if (3===values.length) {return this.#four(values)}
            else {throw new TypeError(`UrlItem.read解析エラー。TABコード数は0〜3までです。`)}
        }
    }
    #one(values) { return this.#make(values[0]) } // readSlugOnly
    #two(vs) { // slug+title / slug+text / id+slug
        if (this.#isQuote(vs[1])){return #this.make(vs[0], vs[0], vs[1], vs[1])} //slug+title
        else if (vs[1].startsWith('title=')) {const two=vs[1].replace(/^title=/,'');return #this.make(vs[0], vs[0], two, two)} // slug+title
        else if (vs[1].startsWith('text=')) {const two=vs[1].replace(/^title=/,'');return #this.make(vs[0], vs[0], vs[0], two)} // slug+text
        else {throw new TypeError(`UrlItem.#two() 二番目は""で囲まれているかtitle= text=のいずれかで始まるべきです。`)}
    }
    #three(values) { // slug+title+text / id+slug+title / id+slug+text
        if (this.#isQuote(vs[1])){
            if (this.#isQuote(vs[2])) {return #this.make(vs[0], vs[0], vs[1], vs[2])}//slug+title+text
            else {return throw new TypeError(`UrlItem.#three() 二番目が""で囲われているなら三番目の要素も""で囲うべきです。`)}
        } else {
            const [id, slug] = [vs[0], vs[1]];
            const title = this.#getString('title', vs[2])
            const text = vs[2].startsWith('text=') ? vs[2].replace(/^text=/,'') : id;
            return #this.make(slug, id, title, text);
        }
    }
    #four(values) { // id+slug+title+text
        if (this.#isQuote(vs[1])) {throw new TypeError(`UrlItem.#four() 二番目はslugであり"を使えません。`)}
        const [id, slug] = [vs[0], vs[1]];
        const title = this.#getString('title', vs[2]);
        const text = this.#getString('text', vs[3]);
        return #this.make(slug, id, title, text);
    }
    #isQuote(v) {return `' "`.some(q=>q.startsWith(q) && q.endsWith(q)) }
    #hasTitleKey(v) {return v.replace(/^title=/,'')}
    #getString(type, v) {
        if (this.#isQuote(v)) {return v.match(/^"(.+)"$/)[1]}
        else if (v.startsWith(`${type}=`)) {return v.replace(new RegExp(`^${type}=`),'')}
        else {throw new TypeError(`文字列ではありません。`)}
    }
    #make(slug, id, title, text) { return {
        slug: slug,
        id: id ?? id : slug,
        title: title ?? id ?? slug,
        text: text ?? title ?? id ?? slug,
    } }
}
window.UrlFenceParser = UrlFenceParser;
})();

