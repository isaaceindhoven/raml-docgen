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

var fs = require("fs");
var path = require("path");

// Constructor
function Core() {
    this.version = 0.1;
    this.parsers = [];
    this.writers = [];
    this.writerNames = [];
    init(this);
}

function init(Core) {
    // We want to load the options module first
    var mod = require('./core/options.js');
    for (var functionName in mod) {
        Core[functionName] = mod[functionName];
    }

    // The other modules can be loaded in any order
    var files = fs.readdirSync(path.join(__dirname, 'core'));
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.match(/[^options].*\.js/i)) {
            var mod = require('./core/' + file);
            for (var functionName in mod) {
                Core[functionName] = mod[functionName];
            }
        }
    }
}

// export the class
module.exports = Core;
