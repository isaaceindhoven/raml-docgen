var Core = module.exports;

var fs = require("fs");
var commandLineArgs = require("command-line-args");

Core.requiredOptions = [];
Core.optionDefinitions = [];
Core.options = {};

// Verify that all required options are present
Core.verifyOptions = function() {
  var missing = []
  for(var i in this.requiredOptions) {
    if(this.options[this.requiredOptions[i]] == undefined) missing.push(this.requiredOptions[i]);
  }
  if(missing.length > 0) throw "ERROR: \tMissing properties: " + missing.join(",");
}

Core.parseOptions = function() {
  var cmdOptions = commandLineArgs(this.optionDefinitions);
  var returned = {};

  // Load config file
  if(cmdOptions.config != undefined) returned = JSON.parse(fs.readFileSync(cmdOptions.config, "utf8"));

  // Parse arguments, overwriting config file entries
  for(var key in cmdOptions) {
    returned[key] = cmdOptions[key];
  }
  this.options = returned;
  if(this.options.headerregex != undefined) this.headerRegexp = new RegExp(this.options.headerregex);

  if(this.options.debug) {
    console.log("\tDEBUG INFO:");
    console.log("\tSettings:");
    console.log(JSON.stringify(this.options, null, 2));
    console.log();
  }
}
