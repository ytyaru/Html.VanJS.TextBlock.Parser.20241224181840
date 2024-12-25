class DefaultTextBlockSyntaxParser {
    constructor() {this.init();}
    init(){this._count=-1;}
    parse(block) {
        block.textBlocks = this.parseSyntax(block)
        block.htmlBlocks = this.parseHtml(block.blocks)
        return block
    }
    #parseSyntax(block) {
        this._count++;
        return this.#toSyntaxBlocks(block.body)
    }
    #parseHtml(textBlocks) {
        const htmls = []
        for (let textBlock of textBlocks) {
            htmls.push(this.#toHtmlBlock(textBlock))
        }
        return htmls
    }
    #toSyntaxBlocks(text) {
        const [blocks,start] = [[],0]
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
        return blocks.filter(v=>v).map((b,i)=>{b.blockIndex=this._count+i;return b}) // 全体で何番目のテキストブロックか
//        return blocks.filter(v=>v)
    }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
    #toHtmlBlock(textBlock) { // h1〜h6, p, ...
        if (block.body.startsWith('#')) { // <h1〜h6>
            const match = block.body.match(`^(#{1,}) (.+)`)
            const [meta, body] = [match[1], match[2].trim()]
            const l = meta.length
            return `<h${l} data-tbi="${block.blockIndex}">${this.#inline(body)}</h${l}>`
        } else { // <p>
            return `<p data-tbi="${block.blockIndex}">${this.#inline(body)}</p>`
        }
    }
    #toHtmlInline(text) {// ruby(rp,rt),em,a,span,i,q,kbd,del,ins,img,...
        return text
        // span inline-block
        // a
        // ruby, em, エスケープ
    }
}
