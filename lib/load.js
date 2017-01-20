'use strict';
var fs = require( 'fs' );
var _ = require( 'lodash' );
var path = require( 'path' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();

module.exports = function load( modelFile, fileType = "bin") {
	if (  !_.isString(modelFile) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
		return false;
	}
	this.isBin = false;
  this.modelFile = path.resolve( process.cwd(), modelFile);
	fs.access(this.modelFile, (err) => {
	  if (err) {
	    if (err.code === "ENOENT") {
	      throw new Error('modelFile does not exist');
	      return false;
	    } else {
	      throw err;
				return false;
	    }
	  }
	});
  if(fileType === "utf-8")
	{
		this.isBin = false;
		w2vLeeXun.Load(this.modelFile, "utf-8");
	}
  else
	{
		this.isBin = true;
		w2vLeeXun.Load(this.modelFile);
	}
	return true;
}
