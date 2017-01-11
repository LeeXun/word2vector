'use strict';
var fs = require( 'fs' );
var mime = require( 'mime' );
var _ = require( 'lodash' );
var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;
var utils = require( './utils' );

module.exports = function load( modelFile ) {
	if (  !_.isString(modelFile) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
	}
  this.modelFile = path.resolve( process.cwd(), modelFile);
	this.mime = mime.lookup( modelFile ); // 'text/plain', 'application/octet-stream'
	fs.access(this.modelFile, (err) => {
	  if (err) {
	    if (err.code === "ENOENT") {
	      throw new Error('modelFile does not exist');
	      return;
	    } else {
	      throw err;
	    }
	  }
	});
}

function getDictionary( modelFile )
{
	var vectorFile = fs.readFileSync( modelFile, "utf-8");
	var words = vectorFile.split('\n');
	var result = {}, key = '';
	console.time("buildDict");
	words.map((word) => {
		var tmp = word.split(' ');
		tmp.pop();
		tmp.map((o, i) => {
			if(i == 0)
			{
				key = o;
				result[key] = [];
			}
			else
			{
				result[key].push(parseFloat(o)); // 記得轉成數字
			}
		})
	});
	console.timeEnd("buildDict");
	// fs.writeFileSync(utils.DS_DICT, JSON.stringify(result));
	// return JSON.parse(fs.readFileSync(utils.DS_DICT));
	return result;
}
