var FileLoader = require('./modules/FileLoader.js'),
    Extractor = require('./modules/Extractor.js');

var time = Date.now();
var files = FileLoader.load();
console.log("files loaded in " + (Date.now() - time));
var fiches = Extractor.extract(files.data, files.dictionnaries);
console.log("extracted in " + (Date.now() - time));
console.log(JSON.stringify(fiches[9362733]));