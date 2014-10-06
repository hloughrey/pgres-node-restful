var express = require('express');
var router = express.Router();
var toGeoJson = require('../toGeoJSON');

var pg = require('pg.js'),
    credentials = require('../credentials');

var credentials = credentials.dev;

var conString = "postgres://" + credentials.user + "@" + credentials.host + ":" + credentials.port + "/" + credentials.database

/* GET Results */
router.get('/', function (req, res) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT accident_index, date, day_of_week, "time", speed_limit, police, accident_severity, number_of_vehicles, number_of_casualties, road_type, junction_detail, ped_cross_phyisical, light_conditions, weather_conditions, road_conditions, carriageway_hazards, ST_AsGeoJSON(geom, 6) AS geom from stats19.accident_details', function (err, result) {
            
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('Error running query', err);
            }
            else {
                stream.on('data', toGeoJson(result.rows));
                var featureCollection = toGeoJson(result.rows);
                //console.log(toGeoJson);
            }
             
            res.send(featureCollection);
            
        });
    });
})

module.exports = router;