var Core = module.exports;

var fs = require("fs");
var path = require("path");

Core.loadParsers = function() {
  // The other modules can be loaded in any order
  var files = fs.readdirSync(path.join(__dirname, '../parsers'));
  for (var i = 0; i < files.length; i++) {
  	var file = files[i];
  	if (file.match(/.*\.js/i)) {
  		var mod = require('./../parsers/' + file);
      this.parsers[mod.name] = mod;
  	}
  }
}
