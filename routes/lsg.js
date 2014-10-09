var express = require('express');
var router = express.Router();
var pg = require('pg.js');
var credentials = require("../credentials");
var url = require('url');

var credentials = credentials.live;
var conString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database;

/* GET Results */
router.get('/', function (req, res) {

var geoJsonResults = []; 

    pg.connect(conString, function (err, client, done) {
        var filter = url.parse(req.url, true).query;
        var bbox = filter.bbox;
        //  console.log(bbox);
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        //var query = client.query("SELECT usrn, roadname, description, town, dft_no, adoption_status, street_type, open, notes, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM herefordshire.lsg lsg where usrn = USRN");
        var query = client.query("SELECT usrn, roadname, description, town, dft_no, adoption_status, street_type, open, notes, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM herefordshire.lsg lsg WHERE geom && ST_Transform(ST_GeometryFromText($1, 4326), 27700) AND ST_Intersects(geom, ST_Transform(ST_GeometryFromText($1, 4326), 27700))", [bbox]);
        query.on('row', function (row, result) {
            var qResult = '{ "type": "Feature", "geometry":' + row.geom + ', "properties": { "usrn": "' + row.usrn + '", "roadname": "' + row.roadname + '", "description": "' + row.description + '", "town": "' + row.town + '", "adoption_status": "' + row.adoption_status + '", "street_type":"' + row.street_type + '", "open": "' + row.open + '", "notes": "' + row.notes + '"}}';
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