class TextBlockParser { // 文書全体（フロントマター＋本文（フェンス｜ブロック）＋エンドマター）
    static parse(text) { // text:簡易構文
        if (0===text.trim().length) { return [] }
        text = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        const blocks = []; let start = 0;
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
        blocks.push(this.#trimLine(text.slice(start)))
        return blocks.filter(v=>v)
    }
    static #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
    static toHtml(blocks) { // block:textBlock
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
}
// フェンス（テキストブロックとは別に改行が内容として含まれる）
// 　これを識別するためにはフェンスを示す行頭+++,---,```を抽出せねばならない。
class FenceParser {
    parse(text) {
        if (0===text.trim().length) { return [] }
        text = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
        const fences = []; let start = 0;
        for (let match of text.matchAll(/^`{3,}/gm)) {
            fences.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
    }
    static fences() {

    }
}
class TextBlockParser {

}
