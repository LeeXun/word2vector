'use strict';
var fs = require( 'fs' );
var _ = require( 'lodash' );
var path = require( 'path' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();

module.exports = function load( modelFile, file_type = "bin") {
	if (  !_.isString(modelFile) )
	{
		throw new TypeError( 'load(): param 1 must be string.' );
		return false;
	}
	this.model = {};
	this.isBin = false;
  this.modelFile = path.resolve( process.cwd(), modelFile);
	this.mime = file_type;
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
  if(this.mime === 'utf-8')
	{
		var vectorFile = fs.readFileSync( modelFile, "utf-8");
		var lines = vectorFile.split('\n');
		var result = {}, key = '';
		var lineOne = lines.shift().split(" ");
		var wordSize = lineOne[0];
		var dimension = lineOne[1];
		lines.pop();
		lines.map((line, i) => {
			var fields = line.split(' ');
			fields.pop(); // 結果後面都有一個空白??
			var key = fields.shift();
			fields.map((o, i) => {
				fields[i] = parseFloat(fields[i]);
			})
			result[key] = fields;
		});
		for(var key in result) {
			var len = 0; // normalizing
	    for (var a = 0; a < dimension; a++) len += result[key][a] * result[key][a];
	    len = Math.sqrt(len);
	    for (a = 0; a < dimension; a++) result[key][a] /= len; // normalizing
		}
		this.model = result;
	}
  else
	{
		this.isBin = true;
		w2vLeeXun.Load(this.modelFile);
	}
	return true;
}
