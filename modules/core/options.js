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

var Core = module.exports;

var fs = require("fs");
var commandLineArgs = require("command-line-args");

Core.requiredOptions = [];
Core.optionDefinitions = [];
Core.options = {};

// Verify that all required options are present
Core.verifyOptions = function () {
    var missing = []
    for (var i in this.requiredOptions) {
        if (this.options[this.requiredOptions[i]] == undefined) missing.push(this.requiredOptions[i]);
    }
    if (missing.length > 0) throw "ERROR: \tMissing properties: " + missing.join(",");
}

Core.parseOptions = function () {
    var cmdOptions = commandLineArgs(this.optionDefinitions);
    var returned = {};

    // Load config file
    if (cmdOptions.config != undefined) returned = JSON.parse(fs.readFileSync(cmdOptions.config, "utf8"));

    // Parse arguments, overwriting config file entries
    for (var key in cmdOptions) {
        returned[key] = cmdOptions[key];
    }
    this.options = returned;
    if (this.options.headerregex != undefined) this.headerRegexp = new RegExp(this.options.headerregex);

    if (this.options.debug) {
        console.log("\tDEBUG INFO:");
        console.log("\tSettings:");
        console.log(JSON.stringify(this.options, null, 2));
        console.log();
    }
}
