'use strict';
var fs = require( 'fs' );
// var mime = require( 'mime' );
var _ = require( 'lodash' );
var path = require( 'path' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );

module.exports = function load( modelFile, file_type = "bin") {
	if (  !_.isString(modelFile) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
	}
	this.model = {};
  this.modelFile = path.resolve( process.cwd(), modelFile);
	// this.mime = mime.lookup( modelFile ); // 'text/plain', 'application/octet-stream'
	if(file_type === "utf-8")
	{
		file_type = 'text/plain';
	}
	this.mime = file_type;
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
	var child;
  if(this.mime === 'text/plain')
	{
		var vectorFile = fs.readFileSync( modelFile, "utf-8");
		var words = vectorFile.split('\n');
		var result = {}, key = '';
		// console.time("w2v: buildDict");
		var lineOne = words.shift().split(" ");
		var wordSize = lineOne[0];
		var dimension = lineOne[1];
		words.map((word, i) => {
			// if(i === 0)
			// {
			// 	console.log(word);
			// }
			var tmp = word.split(' ');
			tmp.pop();
			tmp.map((o, i) => {
				if(i == 0)
				{
					key = o;
					result[key] = [];
					// console.log(key);
				}
				else
				{
					result[key].push(parseFloat(o)); // 記得轉成數字
					// console.log(result[key][0]);
				}
			})
		});
		// console.log(result["臺灣"]);
		for(var key in result) {
			// console.log(key);
			var len = 0; // normalizing
			// console.log(result[key]);
	    for (var a = 0; a < dimension; a++) len += result[key][a] * result[key][a];
	    len = Math.sqrt(len);
			// console.log(len);
	    for (a = 0; a < dimension; a++) result[key][a] /= len; // normalizing
		}
		// console.timeEnd("w2v: buildDict");
	}
  else
	{
		child = spawnSync('./binModel2JSON', ['-f', this.modelFile], {cwd: utils.SRC_DIR});
		var errorText = child.stderr.toString().trim();
		if (errorText) {
		  throw new Error(errorText);
		}
		else
		{
			var stdout = child.stdout.toString();
			var lines = stdout.split("\n");
			var result = {};
			lines.map( (l, i) => {
				var c = l.split(","); // to object
				var key = c.shift();
				c.pop();
				for(var j=0; j<c.length; j++) c[j] = parseFloat(c[j]);
				result[key] = c;
			});
			// console.log(result["臺灣"]);
		}
	}
	this.model = result;
	return result;
}
