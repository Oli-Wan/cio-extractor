var couchdb = require("couchdb-api");
var db = couchdb.db("cio");

exports.destroy = function (callback) {
    db.drop(function () {
        callback();
    });
};

exports.create = function (callback) {
    db.create(function () {
        callback();
    });
};

exports.sendData = function (data) {
    db.bulkDocs(data, function () {
        console.log("Save completed");
    });
};