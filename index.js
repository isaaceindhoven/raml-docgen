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
  { name: 'noExpand', alias: 'n', type: Boolean },
  { name: 'headerregex', alias: 'h', type: String, required: false},
  { name: 'headerannotation', alias: 'a', type: String, required: false}
]
const options = commandLineArgs(optionDefinitions)

if(options.debug) {
  console.log("Debug:             " + options.debug);
  console.log("Write JSON:        " + options.json);
  console.log("Style:             " + options.style);
  console.log("Template:          " + options.template);
  console.log("Examples:          " + options.examples);
  console.log("No expand:         " + options.noExpand);
  console.log("Header Regex:      " + options.headerregex);
  console.log("Header Annotation: " + options.headerannotation);
}

if(options.headerregex != undefined) var headerRegexp = new RegExp(options.headerregex);

// Configure Nunjucks
var env = nunjucks.configure('templates/' + options.template);

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);

if(options.noExpand != true) api = api.expand();

var apiJSON = api.toJSON();

// Recursively add parent URI variables and convert methods to UPPERCASE
apiJSON = maintenance(apiJSON, headerRegexp);

if(options.json) writeDebug(apiJSON);

if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);
if(options.headerannotation != undefined) env.addGlobal("headerAnnotation", options.headerannotation);

var res = env.render('template.adoc', {
  api: apiJSON
});

// Save asciidoc
writeAsciidoc(res);

function echoNode(node) {
  if(node.parentUri != undefined) console.log(node.parentUri + "" + node.relativeUri);
  else console.log(node.relativeUri);
  if(node.resources != undefined) node.resources.forEach(echoNode);
}

function maintenance(node, pattern) {
  if(node.relativeUri != undefined) {
    // Convert methods to uppercase
    if(node.methods != undefined) {
      node.methods.forEach(function(m){
        m.method = m.method.toUpperCase();
      });
    }

    // Find headers using regex
    if(pattern != undefined) {
      var match = pattern.exec(node.fullPath);
      if(match != null) {
        if(options.debug) console.log("Found section: " + match[1]);
        node.header = match[1];
      }
    }

    // Find headers using annotation
    if(node.annotations != undefined && node.annotations[options.headerannotation] != undefined) {
      if(options.debug) console.log("Found section: " + node.annotations[options.headerannotation].structuredValue);
      node.header = node.annotations[options.headerannotation].structuredValue;
    }
  }
  
  // Node has children, perform maintenance on them too
  if(node.resources != undefined) {
    node.resources.forEach(function(child) {
      // Set parent Uri and full path
      if(node.fullPath != undefined) {
        child.parentPath = node.fullPath;
        child.fullPath = child.parentPath + "" + child.relativeUri;
      } else {
        child.fullPath = child.relativeUri;
      }

      // inherit parent URI parameters
      if(node.uriParameters != undefined) {
        if(child.uriParameters == undefined) child.uriParameters = {};
        for (var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key];
        }
      }

      // Recurse
      child = maintenance(child, pattern);
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
