var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");

// Handle command line arguments
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'input', alias: 'i', type: String, defaultValue: 'spec.raml' },
  { name: 'template', alias: 't', type: String, defaultValue: 'default' },
  { name: 'style', alias: 's', type: String, required: false },
  { name: 'debug', alias: 'd', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);
var apiJSON = api.toJSON();

// Recursively add parent URI variables and convert methods to UPPERCASE
apiJSON.resources.forEach(setParents);

if(options.debug) writeDebug(apiJSON);

var res;
// Render asciidoc
if(options.style != undefined) {
  res = nunjucks.render('templates/' + options.template + '/template.adoc', {
    api: apiJSON,
    style: options.style
  });
}
else {
  res = nunjucks.render('templates/' + options.template + '/template.adoc', {
    api: apiJSON
  });
}

// Save asciidoc
writeAsciidoc(res);

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

function writeDebug(apiJSON) {
  fs.writeFile("api.json", JSON.stringify(apiJSON, " ", 2), function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
