class TextBlockParser { // 原稿のうち自然言語の部分をブロックに変換する
    constructor(preprocess=null) {
        this.preprocess = preprocess
//        if (!this.preprocess) {this.preprocess = (text)=>text}
    }
    get preprocess() {return this._preprocess}
//    set preprocess(v) {if ('function'===typeof v){this._preprocess = v}}
    set preprocess(v) {console.log('**************:', v);if ('function'===typeof v){this._preprocess = v}}
    parse(script, fbs) { // script:原稿（簡易構文）, fbs:フェンスブロック配列
        console.log(`preprocess:`,this.preprocess)
        const walls = this.#getWalls(script, fbs)
        console.log(`walls:`, walls)
        return this.#getBlocks(walls)
        /*
        script = script.trim().replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        if (0===script.length) { return [] }
        const blocks = []; let start = 0;
        for (let match of script.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(script.slice(start, match.index)))
            start = match.index + 2
        }
        blocks.push(this.#trimLine(script.slice(start)))
        return blocks.filter(v=>v)
        */
    }
    #getWalls(script, fbs) { // script:原稿（簡易構文）, fbs:フェンスブロック配列
        const walls = []
        let [start, end] = [0, 0]
        for (let f=0; f<fbs.length; f++) {
            end = fbs[f].script.start
            //walls.push({start:start, end:fbs[f].script.start, text:script.slice(start, fbs[f].script.start)})
//            const wall = {start:start, end:end, script:script.slice(start, end)}
//            if (this.preprocess) {wall.html = this.preprocess(wall.script, fbs)}
//            walls.push(wall)
            walls.push(this.#makeWall(script, fbs, start, end))
            start = fbs[f].script.end
        }
        end = script.length
        //walls.push({start:start, end:script.length, text:script.slice(start, script.length)})
        //walls.push({start:start, end:end, text:script.slice(start, end)})
        walls.push(this.#makeWall(script, fbs, start, end))
        return walls
    }
    #makeWall(script, fbs, start, end) {
        const wall = {start:start, end:end, script:script.slice(start, end)}
        //if (this.preprocess) {wall.html = this.preprocess(wall.script, fbs)}
        wall.html = (this.preprocess) ? this.preprocess(wall.script, fbs) : null;
        return wall
    }
    #getBlocks(walls) {
        const [blocks] = [[]]
//        console.log(`walls.length:${walls.length}`)
        for (let w=0; w<walls.length; w++) {
            const match = {
                scripts: [...walls[w].script.matchAll(/[\n]{2,}/gm)],
                htmls: walls[w].html ? [...walls[w].html.matchAll(/[\n]{2,}/gm)] : null,
            }
//            console.log(`wall match scripts:`,match.scripts, walls[w].script)
//            console.log(`wall match htmls:`,match.htmls, walls[w].html)
            console.log(`match num equal: ${match.scripts.length} === ${match.htmls.length}`)
            console.assert(match.scripts.length === match.htmls.length)
            const idx = {script:{start:0, end:0}, html:{start:0, end:0}}
//            const matches = walls[w].script.matchAll(/[\n]{2,}/gm)
//            const matches = walls[w].html.matchAll(/[\n]{2,}/gm)
            for (let m=0; m<match.scripts.length; m++) {
//                console.log(`m:${m}`)
                idx.script.end = match.scripts[m].index
                idx.html.end = match.htmls ? match.htmls[m].index : 0
                /*
                const block = {
                    start: walls[w].start + idx.script.start,
                    end: walls[w].start + idx.script.end,
                    script: walls[w].script.slice(idx.script.start, idx.script.end),
                    html: walls[w].html.slice(idx.html.start, idx.html.end),
                }
                */
                //blocks.push(this.#makeBlock(walls, w, idx))
                blocks.push(this.#makeBlock(walls[w], idx))
                idx.script.start = match.scripts[m].index + match.scripts[m][0].length
                idx.html.start = match.htmls ? match.htmls[m].index + match.htmls[m][0].length : 0
//                blocks.push(block)
            }
            if (blocks.length < 1) {continue}
            idx.script.end = walls[w].script.length
            idx.html.end = walls[w].html ? walls[w].html.length : 0
            /*
            const lastWall = walls.slice(-1)[0]
            const lastBlock = {
                start: lastWall.end-1 + idx.script.start,
                //end: lastWall.end-1 + idx.script.end,
                end: lastWall.end-1 + lastWall.script.length,
            }
            lastBlock.script = lastWall.script.slice(lastBlock.start)
            lastBlock.html = lastWall.html ? lastWall.html.slice(match.htmls.slice(-1).index) : null
            blocks.push(lastBlock)
            //blocks.push(this.#makeBlock(walls.slice(-1), idx))
            //blocks.push(this.#makeBlock(walls, w, idx))
            */
            console.log('LLLLLLLLLLLLLLLast:', blocks.slice(-1)[0])
            const lastWall = walls.slice(-1)[0]

            
            const lastBlock = {
                script: {
                    //start: lastWall.end-1 + idx.script.start,
                    //start: lastWall.end-1,
                    //end: lastWall.end-1 + lastWall.script.length,
                    start: blocks.slice(-1)[0].script.end,
                    end: walls[w].end + walls[w].script.length,
                    text: null,
                },
                parse: {html: null},
            }
            //lastBlock.script.text = lastWall.script.slice(lastBlock.script.start)
            //lastBlock.parse.html = lastWall.html ? lastWall.html.slice(match.htmls.slice(-1)[0].index) : null
            //lastBlock.script.text = walls[w].script.slice(lastBlock.script.start)
            lastBlock.script.text = walls[w].script.slice(match.scripts.slice(-1)[0].index + match.scripts.slice(-1)[0][0].length)
            lastBlock.parse.html = walls[w].html ? walls[w].html.slice(match.htmls.slice(-1)[0].index + match.htmls.slice(-1)[0][0].length) : null
            blocks.push(lastBlock)
        }
        return blocks.sort((a,b)=>a.script.start - b.script.start)
    }
    #makeBlock(wall, idx) {
//        console.log(idx.html.start, idx.html.end)
        return {
            script: {
                start: wall.start + idx.script.start,
                end: wall.start + idx.script.end,
                text: wall.script.slice(idx.script.start, idx.script.end),
            },
            parse: {
                html: wall.html ? wall.html.slice(idx.html.start, idx.html.end) : null,
            },
        }
    }
    /*
    #makeBlock(wall, idx) {
        return {
            start: wall.start + idx.script.start,
            end: wall.start + idx.script.end,
            script: wall.script.slice(idx.script.start, idx.script.end),
            html: wall.html ? wall.html.slice(idx.html.start, idx.html.end) : null,
        }
    }
    #makeBlock(walls, w, idx) {
        return {
            start: walls[w].start + idx.script.start,
            end: walls[w].start + idx.script.end,
            script: walls[w].script.slice(idx.script.start, idx.script.end),
            html: walls[w].html ? walls[w].html.slice(idx.html.start, idx.html.end) : null,
        }
    }
    */
    /*
    static #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
    static toHtml(blocks) { // block:scriptBlock
        return blocks.map(b=>((b.startsWith('# ')) ? h1(this.#inline(b.slice(2))) : p(this.#inline(b))))
    }

    static fence(block) {
        if (block.startsWith('```') && block.endsWith('```')) {
        }
        block.startsWith('```')
        block.endsWith('```')
        const start = /^[`]{3,}/gm
        const end = /^[`]{3,}$/gm
    }
    */
}
/*
// フェンス（テキストブロックとは別に改行が内容として含まれる）
// 　これを識別するためにはフェンスを示す行頭+++,---,```を抽出せねばならない。
class FenceParser {
    parse(script) {
        if (0===script.trim().length) { return [] }
        script = script.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        const fences = []; let start = 0;
        for (let match of script.matchAll(/^`{3,}/gm)) {
            fences.push(this.#trimLine(script.slice(start, match.index)))
            start = match.index + 2
        }
    }
    static fences() {

    }
}
class TextBlockParser {

}
*/
