var express = require('express');
var router = express.Router();
var dbgeo = require('dbgeo');
var pg = require('pg.js');
var url = require('url');
var credentials = require("../credentials");

var credentials = credentials.live;
var conString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database
/* GET Results */

router.get('/', function (req, res) {

    pg.connect(conString, function (err, client, done) {
        var filter = url.parse(req.url, true).query;
        var bbox = filter.bbox;
        if (err) {
            return console.error('Error fetching client from pool', err);
        }
        var query = "SELECT usrn, roadname, description, town, dft_no, adoption_status, street_type, open, notes, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM herefordshire.lsg lsg WHERE ST_Intersects(geom, ST_Transform(ST_GeometryFromText($1, 4326), 27700))";
        client.query(query, [bbox], function (err, result) {
            if (err) {
                console.log("Query returned an error. Error code: " + err);
            } else {
                dbgeo.parse({
                    "data": result.rows,
                    "outputFormat": "geojson",
                    "geometryColumn": "geom",
                    "callback": function (error, result) {
                        if (error) {
                            console.log(error);
                        } else {
                            // This will log a valid GeoJSON object
                            res.jsonp(result);
                        }
                    }
                });
            }
        });
    });
})

module.exports = router;