class DefaultFrontMatterSyntaxParser {
//    constructor() {this.init();}
//    init(){this._count=-1;}
    parse(block, blockIndex) {
        // block.bodyをyaml解析してObjectを返す
        return blockIndex + 1
//        return null
//        block.textBlocks = this.#parseSyntax(block)
//        block.htmlBlocks = this.#parseHtml(block.blocks)
//        return block
    }
    #parseSyntax(block, blockIndex) {
//        this._count++;
        return this.#toSyntaxBlocks(block.body)
    }
    #parseHtml(textBlocks, blockIndex) {
        // FrontMatterのデータから表紙を作成する
        return null
        const htmls = []
        for (let textBlock of textBlocks) {
            htmls.push(this.#toHtmlBlock(textBlock))
        }
        return htmls
    }
    #toSyntaxBlocks(text, blockIndex) {
        const [blocks,start] = [[],0]
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
        //return blocks.filter(v=>v).map((b,i)=>{b.blockIndex=this._count+i;return b}) // 全体で何番目のテキストブロックか
//        return blocks.filter(v=>v).map((b,i)=>{b.blockIndex=this._count++;return b}) // 全体で何番目のテキストブロックか
        return blocks.filter(v=>v).map((b,i)=>{b.blockIndex=blockIndex++;return b}) // 全体で何番目のテキストブロックか
//        return blocks.filter(v=>v)
    }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
    #toHtmlBlock(textBlock, blockIndex) { // h1〜h6, p, ...
        if (block.body.startsWith('#')) { // <h1〜h6>
            const match = block.body.match(`^(#{1,}) (.+)`)
            const [meta, body] = [match[1], match[2].trim()]
            const l = meta.length
            return `<h${l} data-bi="${block.blockIndex}">${this.#toHtmlInline(body)}</h${l}>`
        } else { // <p>
            return `<p data-bi="${block.blockIndex}">${this.#toHtmlInline(body)}</p>`
        }
    }
    #toHtmlInline(text) {// ruby(rp,rt),em,a,span,i,q,kbd,del,ins,img,...
        return text
        // span inline-block
        // a
        // ruby, em, エスケープ
    }
}
