var App = require("ghost-app");
var MD5 = require("md5");
var glob = require("glob");

let fontWeaver;

function unique(str) {
    array = str.split("");
    var ret = [];
    array.forEach(function(val) {
        if (ret.indexOf(val) === -1) {
            ret.push(val);
        }
    });
    return ret.join("");
}

fontWeaver = App.extend({
    install: function() {},
    uninstall: function() {},
    activate: function() {
        this.ghost.helpers.register("fontweaver", this.fontWeaverHelper);
    },
    deactivate: function() {},
    fontWeaverHelper: meta => {
        let path = require("path")
        let postMD5 = MD5(meta.data.root.post.updated_at)
        let filename = 
            meta.data.root.post.id + "-" + postMD5 + ".ttf";
        let fontDist = path.resolve("./content/themes/casper/assets/fonts/");
        let files = glob.sync(fontDist + "\\" + meta.data.root.post.id + "*")
        let fileIndex = files.indexOf((fontDist + "\\" + filename).split("\\").join("/"))

        if (files.length == 1 && fileIndex != -1) {
            console.log("文件已经存在")
        }
        else if(files.length > 1){
            console.log("存在多余文件")
            const del = require('del')
            files.splice(fileIndex, 1)
            del(files)
        }
        else {
            console.log("start gen fonts")
            let text = meta.data.root.post.html
            let Fontmin = require("fontmin")
            let rename = require("gulp-rename")
            let fontSrc = path.resolve(
                "./content/apps/font-weaver/fonts/SourceHanSerifSC-Medium.ttf"
            )

            var fontmin = new Fontmin()
                .src(fontSrc)
                .use(
                    Fontmin.glyph({
                        text: unique(text)
                        // hinting: false
                    })
                )
                .use(rename(filename))
                .dest(fontDist);
            fontmin.run(function(err, files) {
                if (err) {
                    throw err;
                }
                console.log(files);
            });
        }
        return (
            "@font-face{ font-family: ohzaiyii; src:url(/assets/fonts/" +
            filename +
            ") } .post-full-content p{font-family: ohzaiyii;}"
        );
    }
});

module.exports = fontWeaver;
