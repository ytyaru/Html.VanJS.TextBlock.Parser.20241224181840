class BlockParser { // fence, text の二種類に大別する
    constructor(pF, pT) {
        this._preprocessor = {fence:pF ? pF : (text)=>text, text: pT ? pT : (text)=>text}
    }
    parse(text) {
        const fences = FenceParser.parse(text)
        return this.#getBlocks(text, fences)
    }
    #getBlocks(text, fences) {
        console.log(fences)
        let [blocks,start,meta,fenceText,isFenceStart,isFrontMatter] = [[],0,null,null,false,false]
        for (let f=0; f<fences.length; f++) {
            if (isFenceStart) { // フェンスブロック
                if (fenceText!==fences[f].fence.text) {continue} // フェンスのネスト（フェンス内コンテンツ）
                else { // フェンスブロック終端を発見した
                    blocks.push(this.#makeFenceBlock(isFrontMatter, meta, text.slice(start, fences[f].start), start, fences[f].start))
                    isFenceStart = false
                    fenceText = null
                }
            } else { // テキストブロック
                // 1. テキストブロックに分割する前に一括変換処理して処理回数を減らす（textblockプリプロセッサ）
                const blockText = this._preprocessor.text(text.slice(start, fences[f].start))
                // 2. テキストブロックに分割する
                blocks.push(this.#makeTextBlock(blockText, start, fences[f].start))
                isFenceStart = true
                fenceText = fences[f].fence.text
                //isFrontMatter = 0===fences[f].start
                isFrontMatter = 0===text.slice(0,fences[f].start).trim().length
                meta = fences[f].option
            }
            start = fences[f].end // フェンスのネストなら実行しない
        }
        blocks.push(this.#makeTextBlock(text.slice(start)))
//        console.log(blocks.filter(b=>console.log(b.body, typeof b.body)))
//        return blocks
        return blocks.filter(b=>b.body.trim())
    }
    #makeTextBlock(body, start, end) { return this.#makeBlock('text', null, body, start, end) }
    #makeFenceBlock(isFrontMatter, meta, body, start, end) { return this.#makeBlock(isFrontMatter ? 'front-matter' : 'fence', meta, body, start, end) }
//    static #makeFenceBlock(meta, body) { return this.makeBlock('fence', meta, body) }
//    static #makeFlontMatterBlock(meta, body) { return this.makeBlock('front-matter', meta, body) }
    #makeBlock(type, meta, body, start, end) { return {type:type, meta:meta, body:body, start:start, end:end} }
    #splitTextBlock(text) {

    }
}
class DefaultTextBlockPreprocessor {
    run() {
        this.p()
    }
    p(text) {
        return 

    }
    br() {

    }
    inlineBlock() {

    }
}
