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
