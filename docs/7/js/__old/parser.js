class Parser { // 原稿をブロックにパースする
    constructor() {
        this._script = null; // 改行コード統一等をした原稿全文
        this._blocks = []; // 原稿をパースした結果
    }
    get script() { return this._script }
    get blocks() { return this._blocks }
    get textBlockPreprocess() {return this._bP.textBlockPreprocess}
    set textBlockPreprocess(fn) {this._bP.textBlockPreprocess=fn}
    parse(text) { // script:原稿（簡易構文が書いてあるstring）
        this._script = this.#trimNewline(this.#unifyNewline(text))
        this._bP = new BlockParser()
        this._blocks = this._bP.parse(this._script)
        return this._blocks
    }
    #unifyNewlien(script) { return script.replaceAll(/(\r\n|\r)/gm, '\n') } // OS毎に異なる改行コードを内部で統一する
    #trimNewline(script) { return script.replaceAll(/^(\n)+$/gm,'').replaceAll(/(\n)+$/gm,'') } // 前後にある改行コードを削除する
}
class BlockParser {
    constructor() {
        this._fbP = new FenceBlockParser()
        this._tbP = new TextBlockParser()
    }
    parse(script) {
        const fbs = this._fbP.parse(script)
        const tbs = this._tbP.parse(script, fbs)
        return [...fbs, ...tbs]
    }
}

/*
class Parser {
    constructor(fmP, fP, tP) {
        this._fmP = fmP ? fmP : new DefaultFrontMatterSyntaxParser()
        this._fP = fP ? fP : new DefaultFenceBlockSyntaxParser()
        this._tP = tP ? tP : new DefaultTextBlockSyntaxParser()
        //this._bP = new BlockParser()
        this._bP = new BlockParser(null, (text)=>RubyParser.parse(text))
        //this._bP = new BlockParser(null, (text)=>{console.log(text);return RubyParser.parse(text)})
        //this._bP = new BlockParser()
    }
    parse(text) {
        // テキストを調整する
        if (0===text.trim().length) { return [] }
        text = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        // テキストからブロックを生成する
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
    }
    get textBlockPreprocess() {return this._bP.textBlockPreprocess}
    set textBlockPreprocess(fn) {this._bP.textBlockPreprocess=fn}
}
*/
