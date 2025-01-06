class HrParser { // <hr>
    static parse(script, blockIndex) { // 将来はclass属性値を指定できるよう拡張するかも？
        return script.replaceAll(/^(={3,})$/gm, (match, p1, p2, offset, string)=>{
            const [L, B] = [p1.length, p2];
            const D = blockIndex ? ` data-bi="${blockIndex}"` : ''
            return `<hr${D}>`
        })
    }
}
