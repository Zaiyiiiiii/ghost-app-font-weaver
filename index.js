var App = require('ghost-app')
let fontWeaver

function unique(str) {
    array = str.split('')
    var ret = [];
    array.forEach(function (val) {
        if (ret.indexOf(val) === -1) {
            ret.push(val);
        }
    });
    return ret.join('');
}

fontWeaver = App.extend({
    install: function () { },
    uninstall: function () { },
    activate: function () {
        this.ghost.helpers.register('fontweaver', this.fontWeaverHelper);
    },
    deactivate: function () { },
    fontWeaverHelper: function (meta) {
        let text = meta.data.root.post.html
        let filename = meta.data.root.post.slug + ".ttf"
        console.log("start gen fonts")
        let path = require('path')
        let Fontmin = require('fontmin')
        let rename = require('gulp-rename')
        let fontSrc = path.resolve('./content/apps/font-weaver/fonts/fzbgsh.ttf')
        let fontDist = path.resolve('./content/themes/casper/assets/fonts/')

        var fontmin = new Fontmin()
            .src(fontSrc)
            .use(Fontmin.glyph({
                text: unique(text),
                hinting: false
            }))
            .use(rename(filename))
            .dest(fontDist)
        fontmin.run(
            function (err, files) {
                if (err) {
                    throw err;
                }
                console.log(files)
            }
        );
        return "@font-face{ font-family: ohzaiyii; src:url(/assets/fonts/" + filename + ") } .post-full-content p{font-family: ohzaiyii;}"
    }
});

module.exports = fontWeaver;