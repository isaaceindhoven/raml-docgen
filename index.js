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
  { name: 'debug', alias: 'd', type: Boolean },
  { name: 'examples', alias: 'e', type: Boolean },
  { name: 'noExpand', alias: 'n', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)

// Configure Nunjucks
var env = nunjucks.configure('templates/' + options.template);

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);
if(options.noExpand) {
  var apiJSON = api.toJSON();
} else {
  var apiJSON = api.expand().toJSON();
}

// Recursively add parent URI variables and convert methods to UPPERCASE
maintenance(apiJSON);

if(options.debug) writeDebug(apiJSON);

var res;
console.log(options.style);
console.log(options.template);
console.log(options.debug);
console.log(options.examples);
console.log(options.noExpand);
if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);

res = env.render('template.adoc', {
  api: apiJSON
});

// Save asciidoc
writeAsciidoc(res);

/**
* Add parentPath variable
* Used for rendering complete paths
* Also converts methods to UPPERCASE
*/
function maintenance(api) {
  // Gather types
  types = {};
  for(index in api.resourceTypes) {
    for(name in api.resourceTypes[index]) {
      types[name] = api.resourceTypes[index][name]
    }
  }

  api.resources.forEach(function(node) {
    nodeMaintenance(node, types);
  });
}

function nodeMaintenance(node, types) {
  // Convert method to uppercase
  if(node.methods != undefined && node.relativeUri != undefined) {
    node.methods.forEach(function(m){
      m.method = m.method.toUpperCase();
    });
  }

  // Node has children, output them too.
  if(node.resources != undefined) {
    node.resources.forEach(function(child) {
      if(node.parentPath != undefined) child.parentPath = node.parentPath + "" + node.relativeUri;
      else child.parentPath = node.relativeUri;
      if(node.uriParameters != undefined){
        if(child.uriParameters == undefined) child.uriParameters = {};
        for (var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key];
        }
      }
      nodeMaintenance(child, api);
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
  });
}
