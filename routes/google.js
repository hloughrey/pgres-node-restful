var express = require('express');
var router = express.Router();
var pg = require('pg.js');
var credentials = require("../credentials");

var credentials = credentials.live;
var conString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database;

/* GET Results */
router.get('/', function (req, res) {

var geoJsonResults = []; 

    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        var query = client.query("SELECT * FROM misc.website_visitors");
        query.on('row', function (row, result) {
            var qResult = '{ "type": "Feature", "geometry":' + row.geom + ', "properties": { "name": "' + row.name + '", "sessions": "' + row.sessions + '", "percentage": "' + row.per_sessions + '"}}';
            geoJsonResults.push(qResult);
        });
        query.on('end', function(result){
            done();
            var geoJsonOutline = '{ "type": "FeatureCollection", "features":[';
            var crsObj = '], "crs":{"type":"EPSG","properties":{"code":"4326"}}}';
            var geoJsonString = geoJsonOutline + geoJsonResults + ']}';
            var geoJsonObj = JSON.parse(geoJsonString); 
            res.jsonp(geoJsonObj);
        })
    });
});

module.exports = router;