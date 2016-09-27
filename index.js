"use strict";
var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");
var commandLineArgs = require("command-line-args");
// Could use json-schema-ref-parser for JSON schema parsing

var requiredOptions = ["input", "template"];

var optionDefinitions = [
  { name: "input",            alias: "i", type: String },
  { name: "template",         alias: "t", type: String },
  { name: "style",            alias: "s", type: String },
  { name: "debug",            alias: "d", type: Boolean },
  { name: "json",             alias: "j", type: Boolean },
  { name: "examples",         alias: "e", type: Boolean },
  { name: "noExpand",         alias: "n", type: Boolean },
  { name: "headerregex",      alias: "h", type: String },
  { name: "headerannotation", alias: "a", type: String },
  { name: "config",           alias: "c", type: String }
];

var options = getOptions(optionDefinitions);

if(options.debug) {
  console.log("\tDEBUG INFO:");
  console.log(JSON.stringify(options, null, 2));
}

verifyOptions(requiredOptions);

if(options.headerregex != undefined) var headerRegexp = new RegExp(options.headerregex);

// ##########
//  Nunjucks
// ##########

// Configure Nunjucks
var env = nunjucks.configure("templates/" + options.template);
if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);

// JSON Stringify filter
env.addFilter("stringify", function(str) {
  if(str.type != undefined) str.type = JSON.parse(str.type);
  return JSON.stringify(str, " ", 2);
});

// Parse and then JSON Stringify to get rid of escaped characters
env.addFilter("parse", function(str) {
  return JSON.stringify(JSON.parse(str), " ", 2);
});

// Anchor filter
env.addFilter("makeAnchor", function(str, prefix) {
  var regExp = new RegExp("/[^\\w]/i");
  var replaced = String(str).replace(regExp, "-");
  return "anchor-" + prefix + "-" + replaced;
});

// ##########
//    API
// ##########

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);

// Write API errors to errors.json
if(api.errors() != undefined) writeErrors(api.errors());

if(options.noExpand != true) api = api.expand();
var apiJSON = api.toJSON();


// Perform maintenance on resources, includes assigning fullPath and finding section headings
apiJSON = maintenance(apiJSON, headerRegexp);

// User wants to see the JSON output, let's give it to them
if(options.json) writeDebug(apiJSON);
if(options.json) writeSchema(apiJSON.schemas);

writeAsciidoc(
  env.render("template.adoc", {
    api: apiJSON
  })
);

// ###########
//  Functions
// ###########

// Convert methods to uppercase, assign fullPath, find headers
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
        node.header = match[1];
      }
    }

    // Find headers using annotation
    if(node.annotations != undefined && node.annotations[options.headerannotation] != undefined) {
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

        for(var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key]
        }
      }

      // Recurse
      child = maintenance(child, pattern);
    });
  }
  return node;
}

// Write completed asciidoc to api.adoc
function writeAsciidoc(templateString) {
  fs.writeFile("api.adoc", templateString, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}

// Write JSON representation of api to api.json file
function writeDebug(apiJSON) {
  fs.writeFile("api.json", JSON.stringify(apiJSON, " ", 2), function(err) {
    if(err) {
      return console.log(err);
    }
  });
}

// Write parser errors to errors.json
function writeErrors(errors) {
  fs.writeFile("errors.json", JSON.stringify(errors, " ", 2), function(err) {
    if(err) return console.log(err);
    else console.log("!!! API parser found errors in RAML spec, see errors.json for details !!!");
  });
}

function writeSchema(schemaJSON) {
  fs.writeFile("schemas.json", JSON.stringify(schemaJSON, " ", 2), function(err) {
    if(err) return console.log(err);
  });
}

// Get saved and command line options (flags)
function getOptions(optionDefinitions) {
  var cmdOptions = commandLineArgs(optionDefinitions);
  var returned = {};

  if(cmdOptions.config != undefined) returned = JSON.parse(fs.readFileSync(cmdOptions.config, "utf8"));

  for(var key in cmdOptions) {
    returned[key] = cmdOptions[key];
  }

  return returned;
}

// Verify that all required options are present
function verifyOptions(requiredOptions) {
  var missing = []
  for(var i in requiredOptions) {
    if(options[requiredOptions[i]] == undefined) missing.push(requiredOptions[i]);
  }
  if(missing.length > 0) throw "ERROR: \tMissing properties: " + missing.join(",");
}
