var express = require('express');
var router = express.Router();
var dbgeo = require('dbgeo');
var query = require('pg-query');
var credentials = require("../credentials");
var url = require('url');

var credentials = credentials.live;

query.connectionParameters = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database

/* GET Results */
router.get('/', function (req, res) {
    var filter = url.parse(req.url, true).query;
    var bbox = "'" + filter.bbox + "'";
    console.log(bbox);
    query("SELECT usrn, roadname, description, town, dft_no, adoption_status, street_type, open, notes, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom FROM herefordshire.lsg lsg WHERE ST_Intersects(geom, ST_Transform(ST_GeometryFromText($1, 4326), 27700))", [bbox], function(err, rows, result) {
        console.log(rows);
    });
});

module.exports = router;