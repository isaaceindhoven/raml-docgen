/**!
 * Copyright (C) 2016 Cas Eliëns
 *
 *     This file is part of RAML documentation generator
 *     RAML documentation generator is free software: you can redistribute it
 *     and/or modify it under the terms of the GNU General Public License
 *     as published by the Free Software Foundation, either version 3 of
 *     the License, or any later version.
 *
 *     RAML documentation generator is distributed in the hope that
 *     it will be useful, but WITHOUT ANY WARRANTY; without even the
 *     implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with RAML documentation generator.
 *     If not, see <http://www.gnu.org/licenses/>.
 **/
 var raml = require("raml-1-parser");

function RAMLParser(Core){
  this.c = Core;
}

RAMLParser.prototype.name = "RAMLParser";
RAMLParser.prototype.c = {};

RAMLParser.prototype.maintenance = function(node, pattern) {
  if(node.relativeUri != undefined) {
    // Find headers using regex
    if(pattern != undefined) {
      var match = pattern.exec(node.absoluteUri);
      if(match != null) {
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
  if(node.resources != undefined) {
    node.resources.forEach(function(child) {
      // inherit parent URI parameters
      if(node.uriParameters != undefined) {
        if(child.uriParameters == undefined) child.uriParameters = {};

        for(var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key]
        }
      }

      // Recurse
      child = RAMLParser.prototype.maintenance(child, pattern);
    });
  }
  return node;
}

RAMLParser.prototype.load = function(path) {
  var api = raml.loadApiSync(path);
  return api;
}


module.exports = RAMLParser;
