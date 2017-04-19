/**
 * UNUSED
 */
function Text() {
    this.words = [];
}
Text.prototype.fromPlain = function(text) {

}
Text.prototype.getWord = function(i) {
    return this.words[i];
}

/**
 * UNUSED
 */
function Annotation() {
    this.anchor = undefined;
    this.type = 'note'; // note/subscript/supscript/pointer ?
    this.content = '';
}
Annotation.prototype.idk = function() {

}