"use strict";
var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var $RefParser = require('json-schema-ref-parser');
var c = init();

c.requiredOptions = ["input", "template"];
c.optionDefinitions = [
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
c.parseOptions();
c.verifyOptions();

var rap = new c.parsers.RAMLParser(c); // RAML Parser
var jsp = new c.parsers.JsonSchemaParser(c); // JSON Schema Parser

// Read RAML API
var fName = path.resolve(__dirname, c.options.input);
var api = raml.loadApiSync(fName);

// Write API errors to errors.json
if(api.errors()[0] != undefined) c.writeErrors(api.errors());

if(c.options.noExpand != true) api = api.expand();
var apiJSON = api.toJSON();


var extraSchemas = {};

apiJSON = rap.maintenance(apiJSON, c.headerRegexp);
apiJSON.parsedSchemas = jsp.parseSchemas(apiJSON);
jsp.findSchemas(apiJSON.parsedSchemas, extraSchemas);
apiJSON.extraSchemas = extraSchemas;


// User wants to see the JSON output, let's give it to them
if(c.options.json) c.writeDebug(apiJSON);
if(c.options.json) c.writeSchema(apiJSON.parsedSchemas);

// Write output using all available writers
c.writerNames.forEach(function(writer) {
  var w = new c.writers[writer](c);
  w.init();
  w.write(apiJSON);
});

function init() {
  var Core = require('./modules/Core');
  var c = new Core();

  c.loadParsers();
  c.loadWriters();

  return c;
}
