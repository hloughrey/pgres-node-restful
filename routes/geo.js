var express = require('express');
var router = express.Router();
var dbgeo = require('dbgeo');

var pg = require('pg.js'),
    credentials = require("../credentials");

var credentials = credentials.live;

var conString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database

/* GET Results */
router.get('/', function (req, res) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        client.query('SELECT usrn, roadname, description, town, dft_no, adoption_status, street_type, open, notes, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM herefordshire.lsg lsg WHERE lsg.geom && ST_Transform(ST_MakeEnvelope(-2.7534,52.0438,-2.6851,52.0700, 4326),27700)', function (err, result) {
            dbgeo.parse({
                "data": result.rows,
                "outputFormat": "geojson",
                "geometryColumn": "geom",
                //"geometryType": "wkt",
                "callback": function(error, result) {
                    if (error) {
                        console.log(error);
                    } else {
                        // This will log a valid GeoJSON object
                        res.jsonp(result);
                    }   
                }
            });
        });
    });
})

module.exports = router;