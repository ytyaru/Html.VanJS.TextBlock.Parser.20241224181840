class DefaultTextBlockSyntaxParser {
    constructor() {this._count=0;}
    parseSyntax(block) {
        return {
            index: {
                text: ,
                block: this._count,
            }
            text: block.body,
        }
    }
    parseHtml(block) {
        if (block.body.startsWith('#')) {
            const match = block.body.match(`^(#{1,}) (.+)`)
            const [meta, body] = [match[1], match[2].trim()]
            const l = meta.length
            return `<h${l}>${body}</h${l}>`
        } else {
            return 
        }
        return blocks.map(b=>((b.startsWith('# ')) ? h1(this.#inline(b.slice(2))) : p(this.#inline(b))))
    }
}
