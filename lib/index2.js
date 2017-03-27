'use strict';
var _ = require( 'lodash' );
var load = require( './load' );
var bin2txt = require('./bin2txt');
var train = require( './train' );
var s = require( './getSimilarWords' );
var v = require( './getVectors' );
var n = require( './getNeighbors');
var c = require( './calcs' );
var w2v = {}
w2v.train = train;
w2v.load = load;
w2v.bin2txt = bin2txt;
w2v.getSimilarWords = s.getSimilarWords;
w2v.getNeighbors = n.getNeighbors;
w2v.getVector = v.getVector;
w2v.getVectors = v.getVectors;
w2v.similarity = c.similarity;
w2v.add = c.add;
w2v.substract = c.substract;
w2v.checkModelFile = function() {
  if(!this.hasOwnProperty("modelFile"))
  {
    throw new Error( 'Use w2v.load() before this function.' );
    return;
  }
  if(_.isString(this.modelFile) === false)
  {
    throw new Error( 'modelFile is not a string.' );
    return;
  }
}
module.exports = w2v;
