/**!
 * Copyright (C) 2016 Cas Eliëns
 *
 *     This file is part of RAML documentation generator
 *     RAML documentation generator is free software: you can redistribute it
 *     and/or modify it under the terms of the GNU General Public License
 *     as published by the Free Software Foundation, either version 3 of
 *     the License, or any later version.
 *
 *     RAML documentation generator is distributed in the hope that
 *     it will be useful, but WITHOUT ANY WARRANTY; without even the
 *     implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with RAML documentation generator.
 *     If not, see <http://www.gnu.org/licenses/>.
 **/

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
