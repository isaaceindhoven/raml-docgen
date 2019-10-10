/*
 *                     Copyright 2017 ISAAC Eindhoven
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require("fs");
var nunjucks = require("nunjucks");

function AsciiDoctorWriter(Core) {
    this.c = Core;
    this.env = {};
}

AsciiDoctorWriter.prototype.name = "AsciiDoctorWriter";

AsciiDoctorWriter.prototype.writeAsciidoc = function (templateString) {
    fs.writeFile("api.adoc", templateString, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

AsciiDoctorWriter.prototype.write = function (apiJSON) {
    this.writeAsciidoc(
        this.env.render("template.adoc", {
            api: apiJSON
        })
    );
}

AsciiDoctorWriter.prototype.init = function () {
    this.env = nunjucks.configure("templates/" + this.c.options.template);
    if (this.c.options.style != undefined) this.env.addGlobal("style", this.c.options.style);
    if (this.c.options.styledir != undefined) this.env.addGlobal("styledir", this.c.options.styledir);
    if (this.c.options.fontdir != undefined) this.env.addGlobal("fontdir", this.c.options.fontdir);
    if (this.c.options.examples) this.env.addGlobal("examples", true);

    // Basically the same as default 'dump' filter, but includes line breaks and tabs for readability
    this.env.addFilter("stringify", function (str) {
        return JSON.stringify(str, [" "], 2);
    });

    // JSON parse and then stringify object
    this.env.addFilter("parse", function (str) {
        return JSON.stringify(JSON.parse(str), [" "], 2);
    });

    // Anchor filter
    this.env.addFilter("makeAnchor", function (str, prefix) {
        var regExp = new RegExp("/[^\\w]/i");
        var replaced = String(str).replace(regExp, "-");
        return "anchor-" + prefix + "-" + replaced.toLowerCase();
    });

    this.env.addFilter("makeRefAnchor", function (str, prefix) {
        var regExp = new RegExp("/[^\\w]/i");
        var name = String(str);
        var nameParts = name.split("/");
        var name = nameParts[nameParts.length - 1];
        var replaced = name.replace(regExp, "-");
        return "anchor-" + prefix + "-" + replaced.toLowerCase();
    });
}


module.exports = AsciiDoctorWriter;
