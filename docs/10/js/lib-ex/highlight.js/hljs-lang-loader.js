class HljsLangLoader {
    constructor(baseDir='') {
        this._baseDir = baseDir;
        this._languages = []; // 読込済の言語名
    }
    get baseDir() {return this._baseDir}
    isLoaded(lang) {return this._languages.includes(lang)}
    load(lang) {
        if (this.isLoaded(lang)) {return}
        this.#insertEl(this.#createEl(lang))
    }
    #createEl(lang) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `${this._baseDir}/${lang}.js`;
        return script
    }
    #insertEl(el) {
        const s = document.querySelector('script')
        if (s) {s.parentNode.insertBefore(el, s); return;}
        const h = document.querySelector('head')
        if (h) {h.append(el); return;}
        document.querySelector('body').append(el)
    }
}
