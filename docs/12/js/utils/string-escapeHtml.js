String.prototype.escapeHtml = function() {
    return this.replace(/[&'`"<>]/g, (match)=>{
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}
