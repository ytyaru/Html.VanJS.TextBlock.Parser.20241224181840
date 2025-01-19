class Renderer {
    constructor(options=null) {
        this._options = options ?? {target:document.querySelector('main') ?? document.body, highlightjs:{version:'11.10.0'}};
        this._highlighter = new Highlighter()
    }
    async render(blocks, el) {
        const elm = el ? el : 'target' in this._options ? this._options.target : document.body;
        elm.style.contentVisibility = 'hidden';
        elm.innerHTML = blocks.filter(b=>'html' in b.parse).reduce((html, b)=>html+=b.parse.html, '');
        this.#highlightJs(blocks)
        elm.style.contentVisibility = 'auto';
    }
    async #highlightJs(blocks) {
        console.log(blocks)
        const codeBlocks = blocks.filter(b=>'fence' in b && 'code'===b.fence.type && b.fence.ary && 0 < b.fence.ary.length)
        //const langs = [...new Set(codeBlocks.map(b=>b.fence.ary[0]))]
        const codeInlines = [...document.querySelectorAll(`p code`)]
        //const langs = [...new Set([...codeBlocks.map(b=>b.fence.ary[0]), ...this.#getLangFromInline(codeInlines)])].filter(v=>v)
        const langs = [...new Set([...codeBlocks.map(b=>HljsAlias.getId(b.fence.ary[0])), ...this.#getLangFromInline(codeInlines)])].filter(v=>v)
        console.log(langs)
        if ('highlightjs' in this._options) {
            await this._highlighter.load(langs, ['a11y-dark'])
            console.log(hljs.listLanguages())
            hljs.highlightAll(); // <pre><code>をハイライトする
            // v11.0: highlightBlock -> highlightElement
            await this.#inlineCode(codeInlines)
        }
    }
    #getLangFromInline(codeInlines) {
        const langs = []
        for (let el of codeInlines) { // <p><code>をハイライトする
            const classes = el.className.split(' ');
            console.log(classes)
            if (classes.some(c=>c.startsWith('language-'))) {
                const targets = classes.filter(c=>c.startsWith('language-'))
                console.log(targets)
                for (let target of targets) {
                    const lang = target.replace(/^language\-/, '')
                    console.log(lang)
                    const id = HljsAlias.getId(lang)
                    console.log(id)
                    if (lang!==id) {
                        el.classList.remove(target)
                        el.classList.add(`language-${id}`)
                    }
                    langs.push(id)
                }
            }
        }
        console.log(langs)
        return langs
    }
    async #inlineCode(codeInlines) {
        for (let el of codeInlines) { // <p><code>をハイライトする
            this.#renameClass(el)
            el.innerHTML = el.innerHTML.sanitize()
//            console.log(el.innerHTML.sanitize())
            hljs.highlightElement(el)
        }
    }
    #renameClass(el) {
        const classes = el.className.split(' ');
        if (classes.some(c=>c.startsWith('language-'))) {
            const targets = classes.filter(c=>c.startsWith('language-'))
            for (let target of targets) {
                const lang = target.replace(/^language\-/, '')
                const id = HljsAlias.getId(lang)
                if (lang!==id) {
                    el.classList.remove(target)
                    el.classList.add(`language-${id}`)
                }
                console.log(el.className)
            }
        }
    }
}
class Highlighter {
    constructor(use='hljs') {
        this._use = use;
        this._loader = {hljs:null, shiki:null}
        if ('hljs'===this._use){this._loader[this._use] = new HljsLoader()}
    }
    async load(...args) { return await this._loader[this._use].load(...args) }
}
/*
class HljsAlias {
    constructor() {
        this._alias = new Map([
            ['asciidoc', ['ad', 'adoc']],
            ['xml', ['html']],
            ['c', ['h']],
            ['cpp', ['c++','h++','hpp']],
            ['csharp', ['c#','cs']],
            ['fsharp', ['f#','fs']],
            ['markdown', ['md']],
            ['makefile', ['mk']],
            ['python-repl', ['py-repl']],
            ['python', ['py']],
            ['ruby', ['rb']],
            ['rust', ['rs']],
            ['shell', ['sh']],
            ['typescript', ['ts']],
        ]);
    }
    getId(name) {
        name = name.toLowerCase();
        for (let [key, aliases] of this._alias.entries()) {
            if (key===name || aliases.includes(name)) {return key}
        }
        return name
    }
}
window.HljsAlias = new HljsAlias();
*/
class HljsLoader {
    constructor() {
        this._version = '11.10.0'
        this._baseUrl = `../lib/highlight/${this._version}/`
        this._paths = {
            core: 'no-module/no-lang/highlight.min.js',
            languages: new Set(),
            styles: new Set(),
        };
        this._loadMap = new Map();
        /*
        this._alias = new Map([
            ['asciidoc', ['ad']],
            ['xml', ['html']],
            ['c', ['h']],
            ['cpp', ['c++','h++','hpp']],
            ['csharp', ['c#','cs']],
            ['fsharp', ['f#','fs']],
            ['markdown', ['md']],
            ['makefile', ['mk']],
            ['python-repl', ['py-repl']],
            ['python', ['py']],
            ['ruby', ['rb']],
            ['rust', ['rs']],
            ['shell', ['sh']],
            ['typescript', ['ts']],
        ]);
///tmp/work/Html.VanJS.TextBlock.Parser.20241224181840/docs/lib/highlight/11.10.0/no-module/no-lang/highlight.min.js
        */
    }
    get #corePath() {return `${this._baseUrl}${this._paths.core}`}
//    #getLangPath(ids) { return ids.map(id=>`${this._baseUrl}no-module/all-lang/languages/${id}.min.js`) }
//    #getStylePath(ids) { return ids.map(id=>`${this._baseUrl}no-module/all-lang/styles/${id}.min.css`)
    #getLangPaths(ids) { return ids.map(id=>this.#getLSPath('languages', id)) }
    #getStylePaths(ids) { return ids.map(id=>this.#getLSPath('styles', id)) }
    //#getLSPath(ls, name, isFull=false) {return `${this._baseUrl}no-module/all-lang/${ls}/${'languages'===ls ? this.#langNameToId(name) : name}${isFull ? '' : '.min'}.${'languages'===ls ? 'js' : 'css'}`}
    #getLSPath(ls, name, isFull=false) {return `${this._baseUrl}no-module/all-lang/${ls}/${'languages'===ls ? HljsAlias.getId(name) : name}${isFull ? '' : '.min'}.${'languages'===ls ? 'js' : 'css'}`}
    /*
    #langNameToId(name) {
        name = name.toLowerCase();
        for (let [key, aliases] of this._alias.entries()) {
            if (key===name || aliases.includes(name)) {return key}
        }
        return name
    }
    */
    async load(langIds, styleIds) {
        const loader = new AsyncDynamicLoader()
        console.log(this.#corePath)
        //if (!this._loadMap.has(this.#corePath)) {await loader.series(this.#corePath)}
        if (!this._loadMap.has(this.#corePath)) {await loader.series(this.#corePath); console.log('XXXXXXXXXXXXXXXXXXXXXXXX',hljs);}
        const paths = [...this.#getLangPaths(langIds), ...this.#getStylePaths(styleIds)].filter(path=>path && !this._loadMap.has(path));
        console.log(paths)
        //if (0 < paths.length) {await loader.all(...paths)}
        if (0 < paths.length) {const results = await loader.allSettled(...paths);console.log(hljs,results);}
        //await loader.all(...[...paths].map(path=>!this._loadMap.has(path)).filter(v=>v))
    }
    async loadLangs(...langIds) {
        const loader = new AsyncDynamicLoader()
        if (!this._loadMap.has(this.#corePath)) {await loader.series(this.#corePath)}
        const paths = this.#getLangPaths([...langIds]).map(p=>!this._loadMap.has(p)).filter(p=>p);
        if (0 < paths.length) {await loader.all(...paths)}
    }
    async loadStyles(...styleIds) {
        const loader = new AsyncDynamicLoader()
        if (!this._loadMap.has(this.#corePath)) {await loader.series(this.#corePath)}
        const paths = this.#getStylePaths([...styleIds]).map(p=>!this._loadMap.has(p)).filter(p=>p);
        if (0 < paths.length) {await loader.all(...paths)}
    }
    /*
    async load(...paths) {
        const loader = new AsyncDynamicLoader()
        if (!this._loadMap.has(this.#corePath)) {await loader.series(this.corePath)}
        await loader.all(...[...paths].map(path=>!this._loadMap.has(path)).filter(v=>v))
    }
    #getLoadPath(...paths) {
        const lp = []
        if (!this._loadMap.has(this.corePath)) { lp.push(this.corePath) }
        return [this._loadMap.has(this.corePath) ? null : this.corePath, 
                ...[...paths].map(path=>!this._loadMap.has(path))].filter(v=>v);
    }
    async #loadCore(loader) {
        if (!this._loadMap.has(this.corePath)) {
            await loader.series(this.corePath)
            this._loadMap.set(this.corePath)
        }
    }
    async #loadLanguages(loader, ...paths) {
        for (let path of paths) {
            if (!this._loadMap.has(path)) {
        }
        if (!this._loadMap.has('languages')) {
            this._loadMap.set('languages', new )
            await loader.series(this.corePath)
            this._loadMap.set('core', this.corePath)
        }
    }
    */
}
