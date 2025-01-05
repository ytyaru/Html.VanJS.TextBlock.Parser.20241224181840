class ParagraphParser { // <p>
    static parse(script, blockIndex) { // 将来は前後に改ページや空白を挿入できるような変数を拡張するかも？
        console.log(script)
        return script.replaceAll(/^　([\s\S]+)$/gm, (match, p1, offset, string)=>{
            console.log(match, p1, typeof p1)
            const content = p1.replaceAll('\n','<br>')
            //const content = p1.replaceAll(/(?!\n)\n/gm, '<br>')
            //const content = p1.replaceAll(/\n(?!\n)/gm, '<br>')
            console.log(content)
            const D = blockIndex ? ` data-bi="${blockIndex}"` : ''
            return `<p${D}>　${content}</p>`
        })
    }
}
