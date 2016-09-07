var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");

// Handle command line arguments
const commandLineArgs = require('command-line-args')
console.log("Reading API specification");
const optionDefinitions = [
  { name: 'input', alias: 'i', type: String, defaultValue: 'spec.raml' },
  { name: 'template', alias: 't', type: String, defaultValue: 'default' }
]
const options = commandLineArgs(optionDefinitions)

var specName = options.input;
var template = options.template;

var fName = path.resolve(__dirname, specName);
var api = raml.loadApiSync(fName);
var apiJSON = api.toJSON();


console.log("Adding parent nodes");
apiJSON.resources.forEach(setParents);

console.log("rendering asciidoc");
var res = nunjucks.render('nunjucks_templates/' + template + '/template.adoc', {
  api: apiJSON
});

writeAsciidoc(res);
console.log("DONE");

/**
* Add parentPath variable
* Used for rendering complete paths
* Also converts methods to UPPERCASE
*/
function setParents(child) {
  // Only print path and methods if this endpoint actually has methods - otherwise skip
  if(child.methods != undefined && child.relativeUri != undefined) {
    child.methods.forEach(function(m){
      m.method = m.method.toUpperCase();
    })
  }

  // Item has children, output them too.
  if(child.resources != undefined) {
    var parent = child;
    child.resources.forEach(function(child) {
      if(parent.parentPath != undefined) child.parentPath = parent.parentPath + "" + parent.relativeUri;
      else child.parentPath = parent.relativeUri;
      if(parent.uriParameters != undefined){
        if(child.uriParameters == undefined) child.uriParameters = {};
        for (var key in parent.uriParameters) {
          child.uriParameters[key] = parent.uriParameters[key];
        }
      }
      setParents(child);
    });
  }
}

function writeAsciidoc(templateString) {
  fs.writeFile("api.adoc", templateString, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
