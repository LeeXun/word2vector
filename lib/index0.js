'use strict';
var mime = require( 'mime' );
var _ = require( 'lodash' );
var path = require( 'path' );
// var load = require( './load' );
var train = require( './train' );
var getSimilar = require( './getSimilar' )(getSimilar);
var getVectors = require( './getVectors' )(getVectors);
// var nt = require( './getNearests');

var Word2Vector = function ( modelFile )
{
  if (  !_.isString(modelFile) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
	}
  this.modelFile = path.resolve( process.cwd(), modelFile);
	this.mime = mime.lookup( modelFile ); // 'text/plain', 'application/octet-stream'
  this.checkModelFile = function()
  {
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
    if(this.mime === 'text/plain')
    {
      throw new Error( 'Only support binary modelFile right now.' );
      return;
    }
  };
  this.getSimilar = n.getSimilar;
  // this.getNearests = nt.getNearests;
}
// Word2Vector.prototype.train = train;
// // Word2Vector.prototype.load = load;
// Word2Vector.prototype.getVectors = v.getVectors;
// Word2Vector.prototype.getSimilar = n.getSimilar;
// Word2Vector.prototype.getSimilarSync = n.getSimilarSync;
// Word2Vector.prototype.getSimilarAsync = n.getSimilarAsync;
// Word2Vector.prototype.getNearests = nt.getNearests;
// Word2Vector.prototype.getNearestsSync = nt.getNearestsSync;
// Word2Vector.prototype.getNearestsAsync = nt.getNearestsAsync;

module.exports = Word2Vector;
