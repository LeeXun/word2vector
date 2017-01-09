'use strict';
var load = require( './load' );
var train = require( './train' );
var n = require( './getNearest' );
var _ = require( 'lodash' );

var w2v = {};
w2v.train = train;
w2v.load = load;
w2v.getNearest = n.getNearest;
w2v.getNearestSync = n.getNearestSync;
w2v.getNearestAsync = n.getNearestAsync;

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
