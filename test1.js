var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");
var specPath = path.resolve(__dirname, "spec");

//var fName = path.resolve(specPath, "c2s-api.raml");
var fName = path.resolve(specPath, "qander1.raml");
var api = raml.loadApiSync(fName);
var apiJSON = api.toJSON();
var jsonString = JSON.stringify(apiJSON, null, 2);
//writeJson(jsonString);

var endpointArray = [];

apiJSON.resources.forEach(echoThing);

var res = nunjucks.render('template.adoc', {
  title: apiJSON.title,
  version: apiJSON.version,
  author: apiJSON.author,
  author_email: apiJSON.authoremail,
  endpoints: endpointArray
});

writeTemplate(res);

// Echo path for an endpoint
function echoThing(item) {
  // Only print path and methods if this endpoint actually has methods - otherwise skip
  if(item.methods != undefined && item.relativeUri != undefined) {
    endpointArray.push(item);
  }

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

function writeTemplate(templateString) {
  fs.writeFile("api.adoc", templateString, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}

// Write the interpreted RAML to file
function writeJson(jsonString) {
  fs.writeFile("api.json", jsonString, function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
