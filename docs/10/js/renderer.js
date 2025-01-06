class Renderer {
    constructor(options=null) {
        this._options = options ?? {target:document.querySelector('main') ?? document.body, highlightjs:{version:'11.11.1'}};
    }
    render(blocks, el) {
        const elm = el ? el : 'target' in this._options ? this._options.target : document.body;
        elm.innerHTML = blocks.filter(b=>'html' in b.parse).reduce((html, b)=>html+=b.parse.html, '');
        if ('highlightjs' in this._options) {
            hljs.highlightAll(); // <pre><code>をハイライトする
            // v11.0: highlightBlock -> highlightElement
            for (let el of document.querySelectorAll(`p code`)) { hljs.highlightElement(el) } // <p><code>をハイライトする
        }

    }
}
