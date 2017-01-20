var path = require( 'path' );
var _ = require( 'lodash' );
var utils = require( './utils' );
var w2vLeeXun = utils.w2vLeeXun();
var w2v = {};
w2v.getSimilarWords = getSimilarWords;
module.exports = w2v;

function getSimilarWords(sword = "臺灣", options = {})
{
  var returnType = "array", N = 40;
  if(options.hasOwnProperty("returnType")) returnType = options.returnType;
  if(options.hasOwnProperty("N")) N = options.N;
  var result = [];
  if(!_.isString(sword))
	{
		console.error("getSimilarWords 1st param should be a string.");
    return;
	}
  this.checkModelFile();
  var string = w2vLeeXun.GetSimilarWords(sword);
  var lines = string.split("\n");
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
