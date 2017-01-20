'use strict';
var _ = require( 'lodash' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();

module.exports = function bin2txt( binFile ) {
	if (  !_.isString( binFile ) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
		return false;
	}
  w2vLeeXun.BinModel2TXT( binFile );
	return true;
}
