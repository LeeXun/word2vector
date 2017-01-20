'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();
var w2v = {};
w2v.getVector = getVector;
w2v.getVectors = getVectors;
module.exports = w2v;

function getVector(word = "臺灣")
{
  return this.getVectors([word], "array")[0]['vector'];
}

function getVectors(words, options = {})
{
  var returnType = "array";
  if(options.hasOwnProperty("returnType")) returnType = options.returnType;
  var result = [];
  this.checkModelFile();
  if(!_.isArray(words))
	{
		throw new Error("param1 is not a array.");// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  while(words.length > 30)
  {
    words.pop();
  }
  var string = w2vLeeXun.GetVectors(words.join());
  var lines = string.split("\n");
  lines.pop();
  if(returnType.toLowerCase() === 'object')
  {
    result = {};
    lines.map((line, i) => {
      var arr = line.split(",");
      var key = arr.shift();
      if(isNaN(arr[0]))
      {
        result[key] = null;
      }
      else
      {
        arr.map((o, j) => {
          arr[j] = parseFloat(arr[j]);
        });
        result[key] = arr;
      }
    });
  }
  else
  {
    result = [];
    lines.map((line, i) => {
      var arr = line.split(",");
      var key = arr.shift();
      if(isNaN(arr[0]))
      {
        result.push({
          word: key,
          vector: null
        });
      }
      else
      {
        arr.map((o, j) => {
          arr[j] = parseFloat(arr[j]);
        });
        result.push({
          word: key,
          vector: arr
        });
      }
    });
  }
  return result;
}
