class Parser {
    constructor(fmP, fP, tP) {
        this._fmP = fmP ? fmP : new DefaultFrontMatterSyntaxParser()
        this._fP = fP ? fP : new DefaultFenceBlockSyntaxParser()
        this._tP = tP ? tP : new DefaultTextBlockSyntaxParser()
        //this._bP = new BlockParser()
        this._bP = new BlockParser(null, (text)=>RubyParser.parse(text))
        //this._bP = new BlockParser(null, (text)=>{console.log(text);return RubyParser.parse(text)})
    }
    parse(text) {
        const blocks = this._bP.parse(text)
        let blockIndex = 0
        for (let i=0; i<blocks.length; i++) {
            const parser = this.#getParser(blocks[i].type)
            if (parser) {
                blockIndex = parser.parse(blocks[i], blockIndex)
            } else { console.warn(`ブロック種別が不正です。:${block.type}\nこのブロックを無視します。`) }
        }
        return blocks
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
