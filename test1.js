var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");

var fName = path.resolve(__dirname, "spec/c2s-api.raml");
var api = raml.loadApiSync(fName);
var jsonString = JSON.stringify(api.toJSON(), null, 2);

var apiJSON = api.toJSON();



console.log(apiJSON.title);
console.log(apiJSON.version);

apiJSON.resources.forEach(echoThing);

// Echo path for an endpoint
function echoThing(item) {
  // Only print path and methods if this endpoint actually has methods - otherwise skip
  if(item.methods != undefined && item.relativeUri != undefined) {
    // Write current path
    if(item.parentPath != undefined) console.log(item.parentPath + item.relativeUri);
    else console.log(item.relativeUri);

    item.methods.forEach(echoMethods);
  }
  console.log();
  // Item has children, output them too.
  if(item.resources != undefined) {
    var parent = item;
    item.resources.forEach(function(item) {
      if(parent.parentPath != undefined) item.parentPath = parent.parentPath + "" + parent.relativeUri;
      else item.parentPath = parent.relativeUri;
      echoThing(item);
    });
  }
}

function echoMethods(item) {
  console.log(item.method.toUpperCase() + ": " + item.description);
}

// Write the interpreted RAML to file
function writeJson(jsonString) {
  fs.writeFile("api.json", jsonString, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
