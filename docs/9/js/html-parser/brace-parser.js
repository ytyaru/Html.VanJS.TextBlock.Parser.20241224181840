class BraceParser { // {...} 多様なHTML要素に置換する
    static parse(script, fbs) { // fbs:将来はフェンスで定義された値で置換できるよう拡張するかも？
        // {https://}
        // {https:// 任意でテキスト}
        // {link URLフェンスで定義したID}
        // {link URLフェンスで定義したID 任意でテキスト}
        // {link URLフェンスで定義したID textId:URLフェンスで定義したテキストID}
        return script.replaceAll(/\{([^\n\{\}]+)\}/gm, (match, p1, offset, string)=>{
            const content = p1.trim()
            const contents = content.split(' ')
            if (content.startsWith('https://')) {
                const url = contents[0]
                const text = (1 < contents.length) ? contents[1] : contents[0]
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
            }
            else if ('link'===contents[0]) {
                // 全体のURLフェンス定義を一つにまとめたものとする
                const urlDs = fbs.filter(fb=>'fence'===fb.block.type && 'url'===fb.fence.type)
                const urlD = urls.filter(u=>u.id===contents[1])
                if (urlD) {
                    const url = urlD.url
                    const text = contents.length < 3 ? urlD.text : (contents[2].startsWith('textId:')) ? contents[2].replace(/^textId:/,'') : contents[2];
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
                } else {console.warn(`URL識別子が存在しなかった。`)}
            }
        })
    }
}
