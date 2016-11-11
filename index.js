"use strict";
var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");
var commandLineArgs = require("command-line-args");
var $RefParser = require('json-schema-ref-parser');

console.time("everything");

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
  { name: "config",           alias: "c", type: String },
  { name: "schemapath",       alias: "p", type: String }
];

var options = getOptions(optionDefinitions);

if(options.debug) {
  console.log("\tDEBUG INFO:");
  console.log("\tSettings:");
  console.log(JSON.stringify(options, null, 2));
  console.log();
}

verifyOptions(requiredOptions);

if(options.headerregex != undefined) var headerRegexp = new RegExp(options.headerregex);

// ##########
//  Nunjucks
// ##########
console.time("configure_nunjucks");
// Configure Nunjucks
var env = nunjucks.configure("templates/" + options.template);
if(options.style != undefined) env.addGlobal("style", options.style);
if(options.examples) env.addGlobal("examples", true);

// Basically the same as default 'dump' filter, but includes line breaks and tabs for readability
env.addFilter("stringify", function(str) {
  return JSON.stringify(str, " ", 2);
});

// JSON parse and then stringify object
env.addFilter("parse", function(str) {
  return JSON.stringify(JSON.parse(str), " ", 2);
});

// Anchor filter
env.addFilter("makeAnchor", function(str, prefix) {
  return makeAnchor(str, prefix);
});

env.addFilter("makeRefAnchor", function(str, prefix) {
  var regExp = new RegExp("/[^\\w]/i");
  var name = String(str);
  var nameParts = name.split("/");
  var name = nameParts[nameParts.length - 1];
  var replaced = name.replace(regExp, "-");
  return "anchor-" + prefix + "-" + replaced.toLowerCase();
});

function makeAnchor(str, prefix) {
  var regExp = new RegExp("/[^\\w]/i");
  var replaced = String(str).replace(regExp, "-");
  return "anchor-" + prefix + "-" + replaced.toLowerCase();
};
console.timeEnd("configure_nunjucks");
// ##########
//    API
// ##########
console.time("read_api");
// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);
console.timeEnd("read_api");
// Write API errors to errors.json
if(api.errors()[0] != undefined) writeErrors(api.errors());

if(options.noExpand != true) api = api.expand();
var apiJSON = api.toJSON();


// Perform maintenance on resources, includes assigning fullPath and finding section headings
console.time("maintenance");

apiJSON = maintenance(apiJSON, headerRegexp);

console.timeEnd("maintenance");
console.time("schemas");

apiJSON.parsedSchemas = parseSchemas(apiJSON);

var extraSchemas = {};
findSchemas(apiJSON.parsedSchemas, extraSchemas);

apiJSON.extraSchemas = extraSchemas;

console.timeEnd("schemas");

// User wants to see the JSON output, let's give it to them
if(options.json) writeDebug(apiJSON);
if(options.json) writeSchema(apiJSON.schemas);

console.time("render_adoc");
console.log("\n\nStart rendering\n\n")

writeAsciidoc(
  env.render("template.adoc", {
    api: apiJSON
  })
);
console.timeEnd("render_adoc");
console.timeEnd("everything");

// ###########
//  Functions
// ###########

function parseSchemas(api) {
  var parsed = {};
  if(api.schemas != undefined) {
    parsed = parseSchema(api.schemas, parsed);
  }
  if(api.types != undefined) {
    parsed = parseSchema(api.types, parsed);
  }
  return parsed;
}

// Go through all schemas to find $refs
// TODO: Make this recursive
function findSchemas(schemas, returned) {
  for(var sname in schemas) {
    if(schemas[sname].parsed) var schema = schemas[sname].parsedType;
    else var schema = schemas[sname].type;
    var path = schemas[sname].path;

    schemas[sname].parsedType = iterateSchema(schema, path, returned)
  }
}

// Go over a schema to find $refs
function iterateSchema(schema, path, returned) {

  for(var p in schema.properties) {
    if(schema.properties[p].$ref != undefined) {
      schema.properties[p].$ref = makeSchema(path, schema.properties[p].$ref, p, returned);
    }
  }
  return schema;
}

// iterateSchema found a $ref, let's parse it
// and add it to the list of found schemas
function makeSchema(path, ref, name, returned) {
  var parser = new $RefParser();
  var data, done = false; // used to force synchrous parsing
  parser.resolve(options.schemapath + path)
  .then(function($refs){
    var newSchema = {};

    var result = $refs.get(ref);
    var refsplit = ref.split("/");

    // Store new data
    newSchema.name = refsplit[refsplit.length -1];
    newSchema.displayName = newSchema.name;
    newSchema.parsedType = result;

    // Build new path
    var pathParts = path.split("/");
    var newPath = "";
    for(var i = 0; i < pathParts.length - 1; i++) {
      newPath += pathParts[i] + "/";
    }
    newPath += ref.split("#")[0];
    newSchema.path = newPath;

    // Store original ref, might be useful in recursion
    newSchema.ref = ref.split("#")[1];
    returned[name] = newSchema;
    data = name;
    done = true;
  });
  require('deasync').loopWhile(function(){return !done;});
  return name;
}

function parseSchema(input, parent) {
  for(var i in input) {
    var schema = input[i];
    for(var d in schema) {
      console.time("iteration\t" + schema[d].name);
      if(schema[d].type != undefined) {
        parent[d] = {};
        parent[d].type = JSON.parse(schema[d].type);
        parent[d].parsed = false;
        if(schema[d].schemaPath != undefined) {
          parent[d].parsed = true;
          parent[d].parsedType = parseType(schema[d].schemaPath);
        }
        parent[d].path = schema[d].schemaPath;
        parent[d].displayName = schema[d].displayName;
        parent[d].name = schema[d].name;
      }
      console.timeEnd("iteration\t" + schema[d].name);
    }
  }
  return parent;
}

function parseType(path) {
  console.time("parseType\t" + path);
  var parser = new $RefParser();
  // Data used to force synchronous parsing
  // Because json schema parser tool only supports async
  // See https://github.com/BigstickCarpet/json-schema-ref-parser/issues/14
  // TODO: Either support async or make this pretty
  var data, done = false;
  parser.parse(options.schemapath + path, function(err, schema){
    if(err) {
      console.error(err);
      return;
    }
    //console.log(schema);
    data = schema;
    done = true;
  });
  // Force synchronous parsing
  require('deasync').loopWhile(function(){return !done;});
  console.timeEnd("parseType\t" + path);
  return data;
}

function typeMaintenance(api) {
  var parser = new $RefParser();
  parser.bundle("my-schema.json");
  var resolved = {};
  api.types().forEach(function(type){
    var temp = type.toJSON()[type.name()];
    if(temp.schemaPath != undefined) {
      // We have some dereferencing to do!
      parser.parse(options.schemapath + temp.schemaPath)
      .then(function(schema){
        resolved[schema.title] = schema;
        console.log(resolved);
      });
    }
  });
  return resolved;
}

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
