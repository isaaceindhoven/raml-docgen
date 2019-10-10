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
var path = require("path");

// Write JSON representation of api to api.json file
Core.writeDebug = function (apiJSON) {
    fs.writeFile("api.json", JSON.stringify(apiJSON, " ", 2), function (err) {
        if (err) {
            return console.error(err);
        }
    });
}

// Write parser errors to errors.json
Core.writeErrors = function (errors) {
    fs.writeFile("errors.json", JSON.stringify(errors, " ", 2), function (err) {
        if (err) return console.error(err);
        else return console.error("!!! API parser found errors in RAML spec, see errors.json for details !!!");
    });
}

// Write JSON representation of schemas to schemas.json file
Core.writeSchema = function (schemaJSON) {
    fs.writeFile("schemas.json", JSON.stringify(schemaJSON, " ", 2), function (err) {
        if (err) return console.error(err);
    });
}
