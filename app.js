var FileLoader = require('./modules/FileLoader.js'),
    Extractor = require('./modules/Extractor.js'),
    db = require('./modules/DatabaseConnection.js');

var time = Date.now();
var files = FileLoader.load();
console.log("Files loaded in " + (Date.now() - time)+"ms");
var fiches = Extractor.extract(files.data, files.dictionnaries);
console.log(fiches.length+" documents extracted in " + (Date.now() - time)+"ms");
console.log("Saving to database...");

db.destroy(function () {
    db.create(function () {
        db.sendData(fiches)
    });
});
