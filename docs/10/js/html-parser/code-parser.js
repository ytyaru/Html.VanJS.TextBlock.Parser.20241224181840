class CodeParser { // <code>〜<code>
    static parse(script, blockIndex) { // 将来は改ページ、サブタイ、装飾などを操作できるよう拡張するかも？
        //return script.replaceAll(/(`{1,}) (.+) ([^\n]+) (`{1,})/gm, (match, start, lang, code, end, offset, string)=>{
        //return script.replaceAll(/(`{1,})([^ \n]+) (.+) (`{1,})/gm, (match, start, lang, code, end, offset, string)=>{
        return script.replaceAll(/(`{2,})([^ \n]+) ([^\n]+) (`{2,})/gm, (match, start, lang, code, end, offset, string)=>{
//            const l = hljs.getLanguage(lang)
//            console.warn(lang, l, l.name, hljs.listLanguages())
            //return `<code class="hljs language-${lang}">${code.sanitize()}</code>`
            //return `<code class="hljs language-${lang}" data-two>${code}</code>`
            lang = 'js'===lang ? 'javascript' : ('html'===lang) ? 'xml' : lang;
            return `<code class="hljs language-${('js'===lang) ? 'javascript' : lang}">${code.replaceAll('`', '&#96;')}</code>`
        }).replaceAll(/(`{1,})(.+)(`{1,})/gm, (match, start, code, end, offset, string)=>{
            //return `<code class="hljs">${code.sanitize()}</code>`
            return `<code class="hljs">${code}</code>`
        });
    }
}

