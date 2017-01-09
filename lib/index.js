'use strict';
var load = require( './load' );
var train = require( './train' );
var n = require( './getSimilar' );
var _ = require( 'lodash' );

var w2v = {};
w2v.train = train;
w2v.load = load;
w2v.getSimilar = n.getSimilar;
w2v.getSimilarSync = n.getSimilarSync;
w2v.getSimilarAsync = n.getSimilarAsync;

w2v.checkModelFile = function checkModelFile(){
  if(_.isString(this.modelFile) === false)
  {
    throw new Error( 'modelFile is not a string.' );
    return;
  }
  if(this.modelFile === undefined)
  {
    throw new Error( 'modelFile is not undefined.' );
    return;
  }
  if(this.this.mime === 'text/plain')
  {
    throw new Error( 'Only support binary modelFile right now.' );
    return;
  }
};
module.exports = w2v;
