var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");
// Could use json-schema-ref-parser for JSON schema parsing

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
  { name: 'headerregex', alias: 'h', type: String, required: false },
  { name: 'headerannotation', alias: 'a', type: String, required: false },
  { name: 'schemalocation', alias: 'l', type: String, required: false }
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
  console.log("Schema Location:   " + options.schemalocation);
}

if(options.headerregex != undefined) var headerRegexp = new RegExp(options.headerregex);

// Configure Nunjucks
var env = nunjucks.configure('templates/' + options.template);
if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);

// JSON Stringify filter
env.addFilter('stringify', function(str) {
  if(str.type != undefined) str.type = JSON.parse(str.type);
  return JSON.stringify(str, " ", 2);
});

// Parse and then JSON Stringify to get rid of escaped characters
env.addFilter('parse', function(str) {
  return JSON.stringify(JSON.parse(str), " ", 2);
});

// Anchor filter
env.addFilter('makeAnchor', function(str, prefix) {
  var pattern = "/[^\w]/i";
  var regExp = new RegExp(pattern);
  var replaced = String(str).replace(regExp, '-');
  return "anchor-" + prefix + "-" + replaced;
});

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);
if(options.noExpand != true) api = api.expand();
var apiJSON = api.toJSON();

writeSchema(apiJSON.schemas);

if(api.errors() != undefined) {
  writeErrors(api.errors());
  console.log("!!! API parser found errors in RAML spec, see errors.json for details !!!");
}

// Perform maintenance on resources, includes assigning fullPath and finding section headings
apiJSON = maintenance(apiJSON, headerRegexp);

if(options.json) writeDebug(apiJSON);

var res = env.render('template.adoc', {
  api: apiJSON
});

// Save asciidoc
writeAsciidoc(res);


// New maintenance method to support schemas
function newMaintenance(api, pattern) {
  api.resources.forEach(function(node) {
    nodeMaintenance(node, pattern);
  });

  api.schemas.forEach(function(schema) {
    for(i in schema) {
      var data = schema[i];
      //TODO: Expand schemas to document them.
    }
  });

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

function writeErrors(errors) {
  fs.writeFile("errors.json", JSON.stringify(errors, " ", 2), function(err) {
    if(err) {
      return console.log(err);
    }
  });
}

function writeSchema(schemaJSON) {
  fs.writeFile("schemas.json", JSON.stringify(schemaJSON, " ", 2), function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
