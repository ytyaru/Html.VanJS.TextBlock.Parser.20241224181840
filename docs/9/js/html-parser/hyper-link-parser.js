class HyperLinkParser { // <a> 外部リンク
    static parse(script, fbs) { // fbs:将来はURLフェンスで定義された値で置換できるよう拡張するかも？
        // {https://}
        // {https:// 任意でテキスト}
        // {link URLフェンスで定義したID}
        // {link URLフェンスで定義したID 任意でテキスト}
        // {link URLフェンスで定義したID textId:URLフェンスで定義したテキストID}
        return script.replaceAll(/\{link ([^\n\{\}]+)\}/gm, (match, p1, p2, offset, string)=>{
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${content}</a>`
        })
    }
}
