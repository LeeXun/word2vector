'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();
var w2v = {};

w2v.getNeighbors = getNeighbors;
module.exports = w2v;
function getNeighbors(v, options = {})
{
  var returnType = "array", N = 40;
  if(options.hasOwnProperty("returnType")) returnType = options.returnType;
  if(options.hasOwnProperty("N")) N = options.N;
  var result = [];
  if(!_.isArray(v))
  {
    console.log(v+" is not an array.");
    if(returnType.toLowerCase() === "object")return {};
    else return [];
  }
  this.checkModelFile();
  var string = w2vLeeXun.GetNeighbors(v.join());
  var lines = string.split("\n");
  lines.pop();
  if(returnType.toLowerCase() === 'object')
  {
    result = {};
    lines.map((line, i) => {
      var arr = line.split(",");
      if(isNaN(arr[1]))
      {
        result[arr[0]] = null;
      }
      else
      {
        result[arr[0]] = parseFloat(arr[1]);
      }
    });
  }
  else
  {
    result = [];
    lines.map((line, i) => {
      var arr = line.split(",");
      if(isNaN(arr[1]))
      {
        result.push({
          word: arr[0],
          cosineDistance: null
        });
      }
      else
      {
        result.push({
          word: arr[0],
          cosineDistance: parseFloat(arr[1])
        });
      }
    });
  }
  return result;
}
