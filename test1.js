var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");

var fName = path.resolve(__dirname, "spec/c2s-api.raml");
var api = raml.loadApiSync(fName);
var jsonString = JSON.stringify(api.toJSON(), null, 2);

var apiJSON = api.toJSON();

// Write the interpreted RAML to file
fs.writeFile("api.json", jsonString, function(err) {
    if(err) {
        return console.log(err);
    }
});

console.log("= " + apiJSON.title);
console.log(apiJSON.version);
