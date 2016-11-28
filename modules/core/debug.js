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
var path = require("path");

// Write JSON representation of api to api.json file
Core.writeDebug = function(apiJSON) {
  fs.writeFile("api.json", JSON.stringify(apiJSON, " ", 2), function(err) {
    if(err) {
      return console.error(err);
    }
  });
}

// Write parser errors to errors.json
Core.writeErrors = function(errors) {
  fs.writeFile("errors.json", JSON.stringify(errors, " ", 2), function(err) {
    if(err) return console.error(err);
    else return console.error("!!! API parser found errors in RAML spec, see errors.json for details !!!");
  });
}

// Write JSON representation of schemas to schemas.json file
Core.writeSchema = function(schemaJSON) {
  fs.writeFile("schemas.json", JSON.stringify(schemaJSON, " ", 2), function(err) {
    if(err) return console.error(err);
  });
}
