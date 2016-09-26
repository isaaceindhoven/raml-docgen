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
  { name: 'json', alias: 'j', type: Boolean },
  { name: 'examples', alias: 'e', type: Boolean },
  { name: 'noExpand', alias: 'n', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)

if(options.debug) {
  console.log("Debug:      " + options.debug);
  console.log("Write JSON: " + options.json);
  console.log("Style:      " + options.style);
  console.log("Template:   " + options.template);
  console.log("Examples:   " + options.examples);
  console.log("No expand:  " + options.noExpand);
}

// Configure Nunjucks
var env = nunjucks.configure('templates/' + options.template);

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);

if(options.noExpand != true) api = api.expand();

var apiJSON = api.toJSON();

// Recursively add parent URI variables and convert methods to UPPERCASE
apiJSON = maintenance(apiJSON);

if(options.json) writeDebug(apiJSON);

if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);

var res = env.render('template.adoc', {
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
  //var returned = api.resources.forEach(nodeMaintenance);
  var returned = nodeMaintenance(api);
  console.log("MAINTENANCE DONE, CHECKING");
  //api.resources.forEach(echoNode);
  return returned;
}

function echoNode(node) {
  if(node.parentUri != undefined) console.log(node.parentUri + "" + node.relativeUri);
  else console.log(node.relativeUri);
  if(node.resources != undefined) node.resources.forEach(echoNode);
}

function nodeMaintenance(node) {
  // Convert method to uppercase
  if(node.methods != undefined && node.relativeUri != undefined) {
    node.methods.forEach(function(m){
      m.method = m.method.toUpperCase();
    });
  }

  // Node has children, perform maintenance on them too
  if(node.resources != undefined) {
    node.resources.forEach(function(child) {
      // Set parent Uri
      if(node.parentPath != undefined) child.parentPath = node.parentPath + "" + node.relativeUri;
      else child.parentPath = node.relativeUri;
      child.fullPath = child.parentPath + "" + child.relativeUri;

      // inherit parent URI parameters
      if(node.uriParameters != undefined) {
        if(child.uriParameters == undefined) child.uriParameters = {};
        for (var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key];
        }
      }

      // Recurse
      child = nodeMaintenance(child);
    });
  }
  return node;
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
