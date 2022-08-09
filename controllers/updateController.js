var globalVariables= require('../init/globals')
var mysql= require('mysql2');

const pool = mysql.createPool({
    host: globalVariables.DB_HOST,
    user: globalVariables.DB_USERNAME,
    database: globalVariables.DB_NAME,
    password: globalVariables.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// update location log of specified user
exports.update_location = function(req, res) {
    // var name = req.params.name;
    const {location} = req.body;
    res.send('NOT IMPLEMENTED: location='+location);
};

exports.upload_audio = function(req, res) {
    // var name = req.params.name;
    const {location} = req.body;
    res.send('NOT IMPLEMENTED: location='+location);
};

exports.upload_video = function(req, res) {
    // var name = req.params.name;
    const {location} = req.body;
    res.send('NOT IMPLEMENTED: location='+location);
};