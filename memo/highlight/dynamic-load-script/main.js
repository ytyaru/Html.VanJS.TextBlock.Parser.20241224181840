window.addEventListener('DOMContentLoaded', (event) => {
//    hljs.registerLanguage(languageName, languageDefinition)
    const hljsLL = new HljsLangLoader('bash-css-js-json-md-sh-sql-ts-wasm-xml-yaml/languages')
    hljsLL.add('bash', 'css', 'javascript', 'json', 'markdown', 'typescript', 'xml')
    hljsLL.load()
    console.log(hljs.listLanguages());
//    hljs.highlightAll();
//    hljs.registerLanguage(languageName, languageDefinition);
});
