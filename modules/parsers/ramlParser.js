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
var raml = require("raml-1-parser");

function RAMLParser(Core) {
    this.c = Core;
}

RAMLParser.prototype.name = "RAMLParser";
RAMLParser.prototype.c = {};

RAMLParser.prototype.maintenance = function (node, pattern) {
    if (node.relativeUri != undefined) {
        // Find headers using regex
        if (pattern != undefined) {
            var match = pattern.exec(node.absoluteUri);
            if (match != null) {
                node.header = match[1];
            }
        }

        // Find headers using annotation
        //TODO: Issue #15: https://github.com/cascer1/raml-docs/issues/15
        // if(node.annotations != undefined && node.annotations[this.c.options.headerannotation] != undefined) {
        //   node.header = node.annotations[this.c.options.headerannotation].structuredValue;
        // }
    }

    // Node has children, perform maintenance on them too
    if (node.resources != undefined) {
        node.resources.forEach(function (child) {
            // inherit parent URI parameters
            if (node.uriParameters != undefined) {
                if (child.uriParameters == undefined) child.uriParameters = {};

                for (var key in node.uriParameters) {
                    child.uriParameters[key] = node.uriParameters[key]
                }
            }

            // Recurse
            child = RAMLParser.prototype.maintenance(child, pattern);
        });
    }
    return node;
}

RAMLParser.prototype.load = function (path) {
    var api = raml.loadApiSync(path);
    return api;
}


module.exports = RAMLParser;
