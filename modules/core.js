var fs = require("fs");
var path = require("path");

// Constructor
function Core() {
  this.version = 0.1;
  this.parsers = [];
  this.writers = [];
  this.writerNames = [];
  init(this);
}

function init(Core) {
  // We want to load the options module first
  var mod = require('./core/options.js');
  for (var functionName in mod) {
    Core[functionName] = mod[functionName];
  }

  // The other modules can be loaded in any order
  var files = fs.readdirSync(path.join(__dirname, 'core'));
  for (var i = 0; i < files.length; i++) {
  	var file = files[i];
  	if (file.match(/[^options].*\.js/i)) {
  		var mod = require('./core/' + file);
  		for (var functionName in mod) {
  			Core[functionName] = mod[functionName];
  		}
  	}
  }
}

// export the class
module.exports = Core;
