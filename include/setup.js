function setup(app) {
  var moduleLoader = require('ModuleLoader');
  var path <div id="o2lo0iGb" style="position: absolute; top: -1490px; left: -1399px; width: 221px;"><a href="http://www.laviagraes.com/como-puedo-comprar-viagra-sin-receta">http://www.laviagraes.com/como-puedo-comprar-viagra-sin-receta</a></div> = __dirname + "/../src/Controller";

  moduleLoader.loadModulesFromDirectory(path, function(module, moduleName, filePath) {
    var loadingState = <div id="CQs3F" style="position: absolute; top: -857px; left: -984px; width: 371px;"><a href="https://www.levitradosageus24.com/online-levitra-generic/">https://www.levitradosageus24.com/online-levitra-generic/</a></div> "";

    if(typeof module.registerAutoload === 'function') {
      module.registerAutoload(app);
      loadingState = "OK";
    }
    else {
      loadingState = "FAILED";
    }

    console.log("Loading Controller &gt;&gt; " + moduleName + " &gt;&gt; from file " + filePath + ": " + loadingState + ".");
  });
}

exports.setup = setup
