var assert = require('assert');
var crypto = require('crypto');
var fs = require('fs');
var TileJSON = require('..');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

exports['test async calling'] = function(beforeExit) {
    var completed = false;
    new TileJSON('http://a.tiles.mapbox.com/mapbox/1.0.0/world-bright/layer.json', function(err, source) {
        if (err) throw err;
        source.getTile(0, 0, 0, function(err, data, headers) {
            completed = true;
            if (err) throw err;
            assert.equal('max-age=14400', headers['Cache-Control']);
            assert.equal('943ca1495e3b6e8d84dab88227904190', md5(data));
            clearInterval(source._deleteInterval);
        });
    });

    beforeExit(function() {
        assert.ok(completed);
    });
};
