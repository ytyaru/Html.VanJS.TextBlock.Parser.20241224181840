class ParagraphParser { // <p>
    static parse(script, blockIndex) { // 将来は前後に改ページや空白を挿入できるような変数を拡張するかも？
        const D = blockIndex ? ` data-bi="${blockIndex}"` : ''
        return `<p${D}>${script}</p>`
    }
}
