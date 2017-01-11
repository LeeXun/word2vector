'use strict';
var load = require( './load' );
var train = require( './train' );
var s = require( './getSimilar' );
var v = require( './getVectors' );
var n = require( './getNearest');
var w2v = {}
w2v.train = train;
w2v.load = load;
w2v.getSimilar = s.getSimilar;
w2v.getSimilarSync = s.getSimilarSync;
w2v.getSimilarAsync = s.getSimilarAsync;
w2v.getNearest = n.getNearest;
w2v.getNearestSync = n.getNearestSync;
w2v.getNearestAsync = n.getNearestAsync;
w2v.getVector = v.getVector;
w2v.getVectors = v.getVectors;
module.exports = w2v;
