var $RefParser = require('json-schema-ref-parser');
var raml = require("raml-1-parser");

function JsonSchemaParser(Core){
  this.c = Core;
}

JsonSchemaParser.prototype.name = "JsonSchemaParser";

JsonSchemaParser.prototype.parseSchemas = function(api) {
  var parsed = {};
  if(api.schemas != undefined) {
    parsed = this.parseSchema(api.schemas, parsed);
  }
  if(api.types != undefined) {
    parsed = this.parseSchema(api.types, parsed);
  }
  return parsed;
}

// Dereference JSON schemas
JsonSchemaParser.prototype.parseSchema = function(input, parent) {
  for(var i in input) {
    var schema = input[i];
    for(var d in schema) {
      if(schema[d].type != undefined) {
        parent[d] = {};
        parent[d].type = JSON.parse(schema[d].type);
        parent[d].parsed = false;
        if(schema[d].schemaPath != undefined) {
          parent[d].parsed = true;
          parent[d].parsedType = this.parseType(schema[d].schemaPath);
        }
        parent[d].path = schema[d].schemaPath;
        parent[d].displayName = schema[d].displayName;
        parent[d].name = schema[d].name;
      }
    }
  }
  return parent;
}

// Parse JSON schema - Basically converts it to a JS object
JsonSchemaParser.prototype.parseType = function(path) {
  var parser = new $RefParser();
  // Data used to force synchronous parsing
  // Because json schema parser tool only supports async
  // See https://github.com/BigstickCarpet/json-schema-ref-parser/issues/14
  // TODO: Either support async or make this pretty
  var data, done = false;
  parser.parse(this.c.options.schemapath + path, function(err, schema){
    if(err) {
      return console.error(err);
    }
    data = schema;
    done = true;
  });
  // Force synchronous parsing
  require('deasync').loopWhile(function(){return !done;});
  return data;
}

// Go through all schemas to find $refs
// TODO: Make this recursive
JsonSchemaParser.prototype.findSchemas = function(schemas, returned) {
  for(var sname in schemas) {
    if(schemas[sname].parsed) var schema = schemas[sname].parsedType;
    else var schema = schemas[sname].type;
    var path = schemas[sname].path;

    schemas[sname].parsedType = this.iterateSchema(schema, path, returned)
  }
}

// Go over a schema to find $refs
JsonSchemaParser.prototype.iterateSchema = function(schema, path, returned) {

  for(var p in schema.properties) {
    if(schema.properties[p].$ref != undefined) {
      schema.properties[p].$ref = this.makeSchema(path, schema.properties[p].$ref, p, returned);
    }
  }
  return schema;
}

// iterateSchema found a $ref, let's parse it
// and add it to the list of found schemas
JsonSchemaParser.prototype.makeSchema = function(path, ref, name, returned) {
  var parser = new $RefParser();
  var data, done = false; // used to force synchrous parsing
  parser.resolve(this.c.options.schemapath + path)
  .then(function($refs){
    var newSchema = {};

    var result = $refs.get(ref);
    var refsplit = ref.split("/");

    // Store new data
    newSchema.name = refsplit[refsplit.length -1];
    newSchema.displayName = newSchema.name;
    newSchema.parsedType = result;

    // Build new path
    var pathParts = path.split("/");
    var newPath = "";
    for(var i = 0; i < pathParts.length - 1; i++) {
      newPath += pathParts[i] + "/";
    }
    newPath += ref.split("#")[0];
    newSchema.path = newPath;

    // Store original ref, might be useful in recursion
    newSchema.ref = ref.split("#")[1];
    returned[name] = newSchema;
    data = name;
    done = true;
  });
  require('deasync').loopWhile(function(){return !done;});
  return name;
}

JsonSchemaParser.prototype.typeMaintenance = function(api) {
  var parser = new $RefParser();
  parser.bundle("my-schema.json");
  var resolved = {};
  api.types().forEach(function(type){
    var temp = type.toJSON()[type.name()];
    if(temp.schemaPath != undefined) {
      // We have some dereferencing to do!
      parser.parse(c.options.schemapath + temp.schemaPath)
      .then(function(schema){
        resolved[schema.title] = schema;
        console.log(resolved);
      });
    }
  });
  return resolved;
}

module.exports = JsonSchemaParser;
