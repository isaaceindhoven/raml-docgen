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

var Core = module.exports;

var fs = require("fs");
var commandLineArgs = require("command-line-args");

Core.requiredOptions = [];
Core.optionDefinitions = [];
Core.options = {};

// Verify that all required options are present
Core.verifyOptions = function() {
  var missing = []
  for(var i in this.requiredOptions) {
    if(this.options[this.requiredOptions[i]] == undefined) missing.push(this.requiredOptions[i]);
  }
  if(missing.length > 0) throw "ERROR: \tMissing properties: " + missing.join(",");
}

Core.parseOptions = function() {
  var cmdOptions = commandLineArgs(this.optionDefinitions);
  var returned = {};

  // Load config file
  if(cmdOptions.config != undefined) returned = JSON.parse(fs.readFileSync(cmdOptions.config, "utf8"));

  // Parse arguments, overwriting config file entries
  for(var key in cmdOptions) {
    returned[key] = cmdOptions[key];
  }
  this.options = returned;
  if(this.options.headerregex != undefined) this.headerRegexp = new RegExp(this.options.headerregex);

  if(this.options.debug) {
    console.log("\tDEBUG INFO:");
    console.log("\tSettings:");
    console.log(JSON.stringify(this.options, null, 2));
    console.log();
  }
}
