/*
 *                     Copyright 2017 ISAAC Eindhoven
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";
var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var $RefParser = require('json-schema-ref-parser');
var c = init();

c.requiredOptions = ["input", "template"];
c.optionDefinitions = [
    {name: "input", alias: "i", type: String},
    {name: "template", alias: "t", type: String},
    {name: "style", alias: "s", type: String},
    {name: "debug", alias: "d", type: Boolean},
    {name: "json", alias: "j", type: Boolean},
    {name: "examples", alias: "e", type: Boolean},
    {name: "noExpand", alias: "n", type: Boolean},
    {name: "headerregex", alias: "h", type: String},
    {name: "headerannotation", alias: "a", type: String},
    {name: "config", alias: "c", type: String},
    {name: "schemapath", alias: "p", type: String},
    {name: "styledir", alias: "y", type: String},
    {name: "fontdir", alias: "f", type: String}
];
c.parseOptions();
c.verifyOptions();

var rap = new c.parsers.RAMLParser(c); // RAML Parser
var jsp = new c.parsers.JsonSchemaParser(c); // JSON Schema Parser

// Read API spec
var specPath = path.resolve(__dirname, c.options.input);
// var api = rap.load(specPath);
var api = raml.loadApiSync(specPath);

// Write API errors to errors.json
if (api.errors()[0] != undefined) c.writeErrors(api.errors());

if (c.options.noExpand != true) api = api.expand();
var apiJSON = api.toJSON();


var extraSchemas = {};

apiJSON = rap.maintenance(apiJSON, c.headerRegexp);
apiJSON.parsedSchemas = jsp.parseSchemas(apiJSON);
jsp.findSchemas(apiJSON.parsedSchemas, extraSchemas);
apiJSON.extraSchemas = extraSchemas;


// User wants to see the JSON output, let's give it to them
if (c.options.json) c.writeDebug(apiJSON);
if (c.options.json) c.writeSchema(apiJSON.parsedSchemas);

// Write output using all available writers
c.writerNames.forEach(function (writer) {
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
