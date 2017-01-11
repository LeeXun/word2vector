'use strict';
var mime = require( 'mime' );
var _ = require( 'lodash' );
var path = require( 'path' );
var load = require( './load' );
var train = require( './train' );
var s = require( './getSimilar' );
var v = require( './getVectors' );
var n = require( './getNearest');
var c = require( './calcs' );
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
w2v.similarity = c.similarity;
w2v.add = c.add;
w2v.substract = c.substract;
w2v.checkModelFile = function() {
  if(this.modelFile === undefined)
  {
    throw new Error( 'Use w2v.load() before this function.' );
    return;
  }
  if(_.isString(this.modelFile) === false)
  {
    throw new Error( 'modelFile is not a string.' );
    return;
  }
  if(this.mime === 'text/plain')
  {
    throw new Error( 'Only support binary modelFile right now.' );
    return;
  }
}
module.exports = w2v;
