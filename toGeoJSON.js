var toGeoJson = function FeatureCollection(rows){
    var featureCollection;

    featureCollection = {
      type: "FeatureCollection",
      totalFeatures: rows.length,
      features: []
    };

    for (var i = 0; i < rows.length; i++) {
      var item, feature, geometry;
      item = rows[i];

      geometry = JSON.parse(item.geom);
      delete item.geom;

      feature = {
        type: "Feature",
        properties: item,
        geometry: geometry
      }

      featureCollection.features.push(feature);
    } 
    return featureCollection;
  }

  module.exports = toGeoJson;