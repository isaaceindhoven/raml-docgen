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
