var fs = require("fs");
var nunjucks = require("nunjucks");

function AsciiDoctorWriter(Core){
  this.c = Core;
  this.env = {};
}

AsciiDoctorWriter.prototype.name = "AsciiDoctorWriter";

AsciiDoctorWriter.prototype.env;

AsciiDoctorWriter.prototype.writeAsciidoc = function(templateString) {
  fs.writeFile("api.adoc", templateString, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}

AsciiDoctorWriter.prototype.write = function(apiJSON) {
  this.writeAsciidoc(
    this.env.render("template.adoc", {
      api: apiJSON
    })
  );
}

AsciiDoctorWriter.prototype.init = function() {
  this.env = nunjucks.configure("templates/" + this.c.options.template);
  if(this.c.options.style != undefined) this.env.addGlobal("style", this.c.options.style);
  if(this.c.options.examples) this.env.addGlobal("examples", true);

  // Basically the same as default 'dump' filter, but includes line breaks and tabs for readability
  this.env.addFilter("stringify", function(str) {
    return JSON.stringify(str, " ", 2);
  });

  // JSON parse and then stringify object
  this.env.addFilter("parse", function(str) {
    return JSON.stringify(JSON.parse(str), " ", 2);
  });

  // Anchor filter
  this.env.addFilter("makeAnchor", function(str, prefix) {
    var regExp = new RegExp("/[^\\w]/i");
    var replaced = String(str).replace(regExp, "-");
    return "anchor-" + prefix + "-" + replaced.toLowerCase();
  });

  this.env.addFilter("makeRefAnchor", function(str, prefix) {
    var regExp = new RegExp("/[^\\w]/i");
    var name = String(str);
    var nameParts = name.split("/");
    var name = nameParts[nameParts.length - 1];
    var replaced = name.replace(regExp, "-");
    return "anchor-" + prefix + "-" + replaced.toLowerCase();
  });
}


module.exports = AsciiDoctorWriter;
