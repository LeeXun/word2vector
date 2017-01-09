'use strict';
var load = require( './load' );
var train = require( './train' );
var getNearest = require( './getNearest' );
var _ = require( 'lodash' );

var w2v = {};
w2v.train = train;
w2v.load = load;
w2v.getNearest = getNearest;
w2v.checkModelFile = function checkModelFile(){
  if(_.isString(this.modelFile) === false)
  {
    console.log("modelFile is not a string.");
    return;
  }
  if(this.modelFile === undefined)
  {
    console.log("modelFile is not undefined.");
    return;
  }
};
module.exports = w2v;
