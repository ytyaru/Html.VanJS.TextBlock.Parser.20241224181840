// フェンス（テキストブロックとは別に改行が内容として含まれる）
// 　これを識別するためにはフェンスを示す行頭+++,---,```を抽出せねばならない。
(function(){
class FenceBlockParser{
    parse(text) {
        const lines = this.#getLines(text)
        return this.#makeFence(text, lines)
    }
    #getLines(text) {
        const lines = []; let start = 0;
        const SIGS = ['-','\\+','`','"']
        for (let SIG of SIGS) {
            const REGEXP = RegExp(`^([${SIG}]{3,})(.*)$`, 'gm')
            console.log(REGEXP)
            let match = null
            while ((match = REGEXP.exec(text)) !== null) {
//                console.log(match)
                const sigTxt = match[1]
                const argTxt = match[2]
                const args = argTxt.trim().split(/( |\{)/).filter(v=>v)
                const type = args[0]
                const optTxt = 1 < args.length ? args[1] : ''
                console.log(`sigTxt:${sigTxt}`)
                console.log(`argTxt:${argTxt}`)
                console.log(`args:`, args)
                const block = {
                    text: match[0],
                    start: match.index,
                    end: REGEXP.lastIndex,
                    fence: {
                        text: sigTxt,
                        sig: SIG.replaceAll('\\',''),
                        len: sigTxt.length,
                        type: this.#getType(SIG.replaceAll('\\','')),
                    },
                    option: {
                        text: argTxt,
                        ary: args,
                        obj: null,
                    },
                }
                console.log(`type:`,block.fence.type)
                // タイプ別処理
                if ('part'===block.fence.type) {
                    block.fence.id = args[0]
                } else if ('code'===block.fence.type) {
                    block.fence.language = args[0]
                }
                lines.push(block)
            }
        }
        return lines.sort((a,b)=>a.start - b.start)
    }
    #makeFence(text, lines) {
        let [blocks,start,meta,fenceText,isFenceStarted,isFrontMatter,startIdx] = [[],0,null,null,false,false,-1]
        console.log(lines)
        for (let i=0; i<lines.length; i++) {
            console.log('line:',lines[i])
            if (isFenceStarted) { // フェンスブロック
                if (lines[startIdx].fence.text!==lines[i].fence.text) {continue} // フェンスのネスト（フェンス内コンテンツ）
                else { // フェンスブロック終端を発見した
                    const end = lines[i].end
                    const ho = lines[startIdx].option
                    const fo = lines[i].option
                    console.log(ho)
                    console.log(fo)
                    const hoa0 = ho.ary[0]
                    const foa0 = fo.ary[0]
                    const block = {
                        script: {
                            start: lines[startIdx].start, // text内における当フェンスブロックの開始位置
                            end: lines[i].end, // text内における当フェンスブロックの終了位置
                            text: '', // フェンスブロック全文
                        },
                        fence: {
                            sig: lines[i].fence.sig, // フェンス記号
                            len: lines[i].fence.len, // フェンス記号数
                            text: lines[i].fence.text, // --- 等のフェンス記号テキスト
                            type: lines[i].fence.type,
                            ary: [],
                            obj: {},
                        }
                    }
                    // タイプ別処理
                    if ('part'===block.fence.type) { block.fence.id = lines[startIdx].fence.id }
                    else if ('code'===block.fence.type) { block.fence.language = lines[startIdx].fence.language }
                    // ary, obj
                    block.header = this.#getHeadFoot(text, ho, lines[startIdx].start+lines[startIdx].fence.len)
                    block.footer = this.#getHeadFoot(text, fo, end)
                    console.log(block.header)
                    console.log(block.footer)
//                    block.fence.ary = [...block.header.ary, ...block.footer.ary]
//                    block.fence.obj = {...block.header.obj, ...block.footer.obj}
                    if (block.header.ary) {block.fence.ary.concat(block.header.ary)}
                    if (block.footer.ary) {block.fence.ary.concat(block.footer.ary)}
                    if (block.header.obj) {block.fence.obj = {...block.fence.obj, ...block.header.obj}}
                    if (block.footer.obj) {block.fence.obj = {...block.fence.obj, ...block.footer.obj}}
                    if (block.header.ary && 0===block.header.ary.length){block.header.ary=null}
                    if (block.footer.ary && 0===block.footer.ary.length){block.footer.ary=null}
                    if (block.fence.ary && 0===block.fence.ary.length){block.fence.ary=null}
                    if (block.header.obj && 0===Object.keys(block.header.obj).length){block.header.obj=null}
                    if (block.footer.obj && 0===Object.keys(block.footer.obj).length){block.footer.obj=null}
                    if (block.fence.obj && 0===Object.keys(block.fence.obj).length){block.fence.obj=null}
                    block.body = {
                        //text: text.slice(block.header.end, block.footer.start),
                        text: text.slice(block.header.end, block.footer.start-block.fence.len).replace(/^[\r?\n]{1,}/gm, '').replace(/[\r?\n]{1,}$/gm, ''),
                        html: null,
                    }
                    blocks.push(block)
                    isFenceStarted = false
                    fenceText = null
                }
            } else {
                startIdx = i
                isFenceStarted = true
            }
        }
        return blocks
    }
    #getType(sig) {
             if ('"'===sig) {return 'quote'}
        else if ('+'===sig) {return 'part'} // type:id (この部品を参照する識別子`{part:id}`として使用する)
        else if ('`'===sig) {return 'code'} // type:language (javascript, html, css, python, ...)
        else if ('-'===sig) {return `free` }
        else {throw new Error(`プログラムエラー。sigが規定値ではありません。:${sig}`)}
    }
    #getHeadFoot(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        console.log(opt)
        const isMultiLine = opt.text.match(/(?:[^\\])\{/) // {が含まれている（\{は除く）
        if (isMultiLine) {
            // {の直後が改行かもしれない。その場合、opt.textではArrayかObjectかの判断ができない。本文全体が必要。
            const obj = {text:null, ary:null, obj:null, start:-1, end:-1}
            obj.start = script.slice(start).match(/[^\\]\{/)
            obj.end = script.slice(start).match(/[^\\]\{/)
            obj.text = script.slice(obj.start, obj.end)
            const isKvs = enclose.body.match(/(?:[^\\])=/) // =が含まれている（\=は除く）
            if (isKvs) {obj.obj = Kvs.read(obj.text)}
            else {obj.ary = obj.text.split('\n').map(line=>line.split(' ')).flat().filter(v=>v)}
            return obj
        } else {
            const obj = {text:opt.text, ary:null, obj:null, start:start, end:start + opt.text.length}
            const isKvs = opt.text.match(/(?:[^\\])=/) // =が含まれている（\=は除く）
            if (isKvs) {obj.obj = Kvs.read(obj.text)}
            else {obj.ary = opt.text.split(' ');}
            return obj
        }
    }
}
class Kvs {
    static read(body) { // body:ヘッダ／フッタの{}内テキスト, eqs:kvの=がある場所
        const eqs = body.match(/[^\\]=/gm)
        const [kvs,keys,values] = [{},[],[]]
        let keyStart = 0
        for (let i=0; i<eqs.length; i++) {
            const key = body.slice(keyStart, eqs[i].index)
            const vkt = body.slice(eqs[i].index+1, i+1<eqs.length ? eqs[i+1].index : body.length)
            const vkts = vkt.split(' ')
//            const nextKey = vtks.slice(-1)
            const value = vkts.slice(0, -1).join(' ')
            kvs[key] = value
            keyStart = eqs[i].index + value.length
        }
        console.log(kvs)
        return kvs
    }
}
/*
class FenceBlockOneLineArrayAnalizer { // ---type opt1 opt2 opt3 hasNotSpaceValue ...
    read(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        return {text:opt.text, ary:opt.text.split(' '), obj:null, start:start, end:start + opt.text.length}
    }
}
class FenceBlockOneLineObjectAnalizer { // ---type{k1=v1 k2=has \= eq. k3=v3}
    read(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        const obj = {text:null, ary:null, obj:null, start:-1, end:-1}
        obj.start = start
        obj.end = start + opt.text.length
        obj.text = script.slice(obj.start+1, obj.end)
        obj.obj = Kvs.read(obj.body)
        return obj
    }
}
class FenceBlockMultiLineArrayAnalizer { // ---type opt1 opt2 \n opt3 opt4S\\nopt4E opt5
    read(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        const obj = {text:null, ary:null, obj:null, start:-1, end:-1}
        // match(/(?:[^\\])\{/)
        obj.start = script.slice(start).match(/[^\\]\{/)
        obj.end = script.slice(start).match(/[^\\]\{/)
        obj.text = script.slice(obj.start, obj.end)
        obj.ary = obj.text.split('\n').map(line=>line.split(' ')).flat().filter(v=>v)
        return obj
    }
}
class FenceBlockMultiLineObjectAnalizer { // ---type{k1=v1 \n k2=has \\n newline. k3=v3}
    read(script, opt, start) { // text:script全文, opt:fence.option, start:script内における開始位置
        const obj = {text:null, ary:null, obj:null, start:-1, end:-1}
        obj.start = script.slice(start).match(/[^\\]\{/)
        obj.end = script.slice(start).match(/[^\\]\{/)
        obj.text = script.slice(obj.start, obj.end)
        obj.obj = Kvs.read(obj.body)
        return obj
    }
}
*/
window.FenceBlockParser = FenceBlockParser;
})();
