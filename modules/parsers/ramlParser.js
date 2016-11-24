function RAMLParser(Core){
  this.c = Core;
}

RAMLParser.prototype.name = "RAMLParser";
RAMLParser.prototype.c = {};

RAMLParser.prototype.maintenance = function(node, pattern) {
  if(node.relativeUri != undefined) {
    // Find headers using regex
    if(pattern != undefined) {
      var match = pattern.exec(node.absoluteUri);
      if(match != null) {
        node.header = match[1];
      }
    }

    // Find headers using annotation
    //TODO: Issue #15: https://github.com/cascer1/raml-docs/issues/15
    // if(node.annotations != undefined && node.annotations[this.c.options.headerannotation] != undefined) {
    //   node.header = node.annotations[this.c.options.headerannotation].structuredValue;
    // }
  }

  // Node has children, perform maintenance on them too
  if(node.resources != undefined) {
    node.resources.forEach(function(child) {
      // inherit parent URI parameters
      if(node.uriParameters != undefined) {
        if(child.uriParameters == undefined) child.uriParameters = {};

        for(var key in node.uriParameters) {
          child.uriParameters[key] = node.uriParameters[key]
        }
      }

      // Recurse
      child = RAMLParser.prototype.maintenance(child, pattern);
    });
  }
  return node;
}

module.exports = RAMLParser;
