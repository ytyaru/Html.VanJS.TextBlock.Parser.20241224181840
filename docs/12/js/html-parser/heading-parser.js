class HeadingParser { // <h1>〜<h6>
    static parse(script, blockIndex) { // 将来は改ページ、サブタイ、装飾などを操作できるよう拡張するかも？
        return script.replaceAll(/^(={1,6}) (.+)$/gm, (match, p1, p2, offset, string)=>{
            const [L, B] = [p1.length, p2];
            const D = blockIndex ? ` data-bi="${blockIndex}"` : ''
            return `<h${L}${D}>${B}</h${L}>`
        })
    }
}
