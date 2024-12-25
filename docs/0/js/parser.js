class Parser {
    constructor(fmP, fP, tP) {
        this._fmP = fmP ? fmP : new DefaultFrontMatterSyntaxParser()
        this._fP = fP ? fP : new DefaultFenceBlockSyntaxParser()
        this._tP = tP ? tP : new DefaultTextBlockSyntaxParser()
    }
    parse(text) {
        const blocks = BlockParser.parse(text)
        for (let i=0; i<blocks.length; i++) {
            const parser = this.#getParser(block.type)
            if (parse) {
                blocks[i].syntaxObj = parser.parseSyntax((blocks[i])) // yaml:blocks[i].body, syntaxObj:yaml→jsonObj
                blocks[i].html = parser.parseHtml(blocks[i]) // obj→html
            } else { console.warn(`ブロック種別が不正です。:${block.type}\nこのブロックを無視します。`) }
            /*
            if ('front-matter'===block.type) {
                blocks[i].syntaxObj = this.#parseFrontMatter(blocks[i]) // yaml:blocks[i].body, syntaxObj:yaml→jsonObj
                blocks[i].html = this.#parseFrontMatterHtml(blocks[i]) // obj→html
            } else if ('fence'===block.type) {
                blocks[i].syntaxObj = this.#parseFence(blocks[i]) // 任意の簡易構文:blocks[i].body
                blocks[i].html = this.#parseFence(blocks[i]) // obj→html
            } else if ('text'===block.type) {
                blocks[i].syntaxObj = this.#parseText(blocks[i]) // 任意の簡易構文:blocks[i].body
                blocks[i].html = this.#parseText(blocks[i]) // obj→html
            } else { console.warn(`ブロック種別が不正です。:${block.type}\nこのブロックを無視します。`) }
            */
        }
        const htmlBlocks = []
        blocks
    }
    #getParser(type) {
        switch(type) {
            case 'front-matter': return this._fmP;
            case 'fence': return this._fP;
            case 'text': return this._tP;
            default: return null;
        }
        /*
        const PTN = [['front-matter', '_fmP'], ['fence', '_fP'], ['text', '_tP']]
        const matches = PTN.filter(P=>P[0]===type)
        if (0===matches.length) {
            console.warn(`ブロック種別が不正です。:${type}\nこのブロックを無視します。`)
            return null
        }
        return this[matches[0][1]]
        */
    }
}
