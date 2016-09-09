var raml = require("raml-1-parser");
var fs = require("fs");
var path = require("path");
var nunjucks = require("nunjucks");

// Handle command line arguments
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'input', alias: 'i', type: String, defaultValue: 'spec.raml' },
  { name: 'template', alias: 't', type: String, defaultValue: 'default' },
  { name: 'style', alias: 's', type: String, required: false },
  { name: 'debug', alias: 'd', type: Boolean }
]
const options = commandLineArgs(optionDefinitions);

// Read API
var fName = path.resolve(__dirname, options.input);
var api = raml.loadApiSync(fName);


// Enumerate all the resources
for (var resNum = 0; resNum < api.resources().length; ++resNum) {
  processResource(api.resources()[resNum]);
}

if(options.debug) writeDebug(api.toJSON());


/**
* Process resource (here we just trace different paramters of URL)
**/
function processResource(res) {
  var relativeUri = res.relativeUri().value();
  var completeRelativeUri = res.completeRelativeUri();

  // Everything happens here
  for (var i = 0; i < res.methods().length; i++) {
    var method = res.methods()[i];
    var methodName = method.method().toUpperCase();
    if(options.debug) console.log(methodName + "\t " + completeRelativeUri);

    for (var x = 0; x < res.allUriParameters().length; x++) {
      var uriParam = res.allUriParameters()[x];
      if(options.debug) console.log("\tURI Parameter:", uriParam.name(), uriParam.type());
    }

    for (var qi = 0; qi < method.queryParameters().length; qi++) {
      var parameter = method.queryParameters()[qi];
      if(options.debug) console.log("\t Query Parameter: ", parameter.name(), parameter.optional());
    }


    for (var y = 0; y < res.securedBy().length; y++) {
      var securedBy = res.securedBy()[y];
      if(options.debug) console.log("\t Secured by: " + securedBy.name());
    }

    for (var ri = 0; ri < method.responses().length; ri++) {
      //TODO: Inherit response types
      var response = method.responses()[ri];

    }

  }

  // Recursive call this function for all subresources
  for (var i = 0; i < res.resources().length; i++) {
    var subRes = res.resources()[i];
    processResource(subRes);
  }
}

function writeDebug(apiJSON) {
  fs.writeFile("api.json", JSON.stringify(apiJSON, " ", 2), function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
