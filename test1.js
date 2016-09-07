var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");

// Handle command line arguments
const commandLineArgs = require('command-line-args')
console.log("Reading API specification");
const optionDefinitions = [
  { name: 'input', alias: 'i', type: String, defaultOption: 'spec.raml' },
  { name: 'template', alias: 't', type: String, defaultOption: 'default' }
]
const options = commandLineArgs(optionDefinitions)

var specName = options.input;
var template = options.template;

var fName = path.resolve(__dirname, "spec/" + specName);
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
function setParents(item) {
  // Only print path and methods if this endpoint actually has methods - otherwise skip
  if(item.methods != undefined && item.relativeUri != undefined) {
    item.methods.forEach(function(m){
      m.method = m.method.toUpperCase();
    })
  }

  // Item has children, output them too.
  if(item.resources != undefined) {
    var parent = item;
    item.resources.forEach(function(item) {
      if(parent.parentPath != undefined) item.parentPath = parent.parentPath + "" + parent.relativeUri;
      else item.parentPath = parent.relativeUri;
      if(parent.uriParameters != undefined){
        if(item.uriParameters == undefined) item.uriParameters = {};
        for (var key in parent.uriParameters) {
          item.uriParameters[key] = parent.uriParameters[key];
        }
      }
      setParents(item);
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
