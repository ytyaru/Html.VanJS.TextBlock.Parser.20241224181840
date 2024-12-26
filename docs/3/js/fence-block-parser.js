// フェンス（テキストブロックとは別に改行が内容として含まれる）
// 　これを識別するためにはフェンスを示す行頭+++,---,```を抽出せねばならない。
class FenceParser {
    static parse(text) {
        if (0===text.trim().length) { return [] }
        text = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        return this.#fences(text)
    }
    static #fences(text) {
        console.log(text)
        const fences = []; let start = 0;
        const SIGS = ['-','\\+','`']
        for (let SIG of SIGS) {
            const REGEXP = RegExp(`^([${SIG}]{3,})(.*)$`, 'gm')
            console.log(REGEXP)
            let match = null
            while ((match = REGEXP.exec(text)) !== null) {
                fences.push({
                    text: match[0],
                    start: match.index,
                    end: REGEXP.lastIndex,
                    fence: {
                        text: match[1],
                        sig: SIG,
                        len: match[1].length,
                    },
                    option: {
                        text: match[2],
                        ary: this.#getOptionArray(match[2]),
                        obj: this.#getOptionObject(match[2]),
                    },
                })
            }
        }
        //return fences
        return fences.sort((a,b)=>a.start - b.start)
    }
    static #getOptionArray(text) { // v1 v2 v3
        const ary = text.trim().split(' ').filter(v=>v)
        return 0 < ary.length ? ary : null
    }
    static #getOptionObject(text) { // k=v k2=v2
        return text.includes('=')
        ? Object.fromEntries(new Map(text.trim().split(' ').filter(v=>v).map(kv=>kv.split('=').map(v=>v.trim()))))
        : null
        /*
        if (text.includes('=')) {
            const kvs = text.trim().split(' ').filter(v=>v)
            return Object.fromEntries(new Map(kvs.map(kv=>kv.split('=').map(v=>v.trim()))))
//            return Object.fromEntries(new Map(text.trim().split(' ').filter(v=>v).map(kv=>kv.split('=').map(v=>v.trim()))))
        } else {return null}
        */
    }
    static #leftRight(eqs) {
        for (let i=0; i<eqs.length-1; i++) {
            let left = eqs[i].slice(Math.min(0,eqs[i].lastIndexOf(' ')))
            let right = eqs[i+1].slice(0, Math.max(eqs[i].indexOf(' '), eqs[i+1].length))

        }
    }
}
/*
class TextBlockParser {

}
*/
