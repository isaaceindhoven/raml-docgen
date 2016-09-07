var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");

console.log("Reading API specification");
var specName = process.argv[2];
var fName = path.resolve(__dirname, "spec/" + specName);
var api = raml.loadApiSync(fName);
var apiJSON = api.toJSON();
var endpointArray = [];

console.log("Adding parent nodes");
apiJSON.resources.forEach(setParents);

console.log("rendering asciidoc");
var res = nunjucks.render('template.adoc', {
  generic: apiJSON,
  endpoints: endpointArray
});

writeAsciidoc(res);
console.log("DONE");

/**
 * Add parentPath variable
 * Used for rendering complete paths
 * Also converts methods to UPPERCASE
 */
function setParents(item) {
  // Only print path and methods if this endpoint actually has methods - otherwise skip
  if(item.methods != undefined && item.relativeUri != undefined) {
    item.methods.forEach(function(m){
      m.method = m.method.toUpperCase();
    })
    endpointArray.push(item);
  }

  // Item has children, output them too.
  if(item.resources != undefined) {
    var parent = item;
    item.resources.forEach(function(item) {
      if(parent.parentPath != undefined) item.parentPath = parent.parentPath + "" + parent.relativeUri;
      else item.parentPath = parent.relativeUri;
      setParents(item);
    });
  }
}

function writeAsciidoc(templateString) {
  fs.writeFile("api.adoc", templateString, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
