var loadModel = require( './model' );
var WordVector = require( './WordVector' );
var train = require( './train' );
// exports
var w2v = {};
w2v.train = train;
w2v.loadModel = loadModel;
w2v.WordVector = WordVector;
module.exports = w2v;
