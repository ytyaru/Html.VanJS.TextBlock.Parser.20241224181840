class DefaultTextBlockSyntaxParser {
    constructor() {this.init();}
    init(){this._count=0;}
    parse(block, blockIndex) {
        block.textBlocks = this.#parseSyntax(block, blockIndex)
        block.htmlBlocks = this.#parseHtml(block.textBlocks, blockIndex)
        return blockIndex + block.textBlocks.length
    }
    #parseSyntax(block, blockIndex) {
        return this.#toSyntaxBlocks(block, blockIndex)
    }
    #parseHtml(textBlocks, blockIndex) {
        console.log(textBlocks)
        const htmls = []
        for (let textBlock of textBlocks) {
            htmls.push(this.#toHtmlBlock(textBlock, blockIndex))
        }
        return htmls
    }
    #toSyntaxBlocks(block, blockIndex) {
        const text = block.body
        let [blocks,start,idx] = [[],0,0]
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push({textIndex:block.start+start, text:this.#trimLine(text.slice(start, match.index))})
            start = match.index + 2
        }
        blocks.push({textIndex:block.start+start, text:this.#trimLine(text.slice(start))})
        console.log(blocks, block)
        console.log(blocks.filter(v=>v.text).map((b,i)=>{b.blockIndex=this._count+i;return b}) )
        return blocks.filter(v=>v.text).map((b,i)=>{b.blockIndex=blockIndex++;return b}) // 全体で何番目のテキストブロックか
    }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
    #toHtmlBlock(textBlock, blockIndex) { // h1〜h6, p, hr, ...
        if (textBlock.text.match(/^={3,}$/)) {return `<hr data-bi="${textBlock.blockIndex}">`}
        else if (textBlock.text.startsWith('=')) { // <h1〜h6>
            const match = textBlock.text.match(`^(={1,}) (.+)`)
            const [meta, body] = [match[1], match[2].trim()]
            const l = meta.length
            return `<h${l} data-bi="${textBlock.blockIndex}">${this.#toHtmlInline(body)}</h${l}>`
        } else { // <p>
            return `<p data-bi="${textBlock.blockIndex}">${this.#toHtmlInline(textBlock.text)}</p>`
        }
    }
    #toHtmlInline(text) {// ruby(rp,rt),em,a,span,i,q,kbd,del,ins,img,...
        return text
        // span inline-block
        // a
        // ruby, em, エスケープ
    }
}
