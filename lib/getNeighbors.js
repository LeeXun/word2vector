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
  if(this.isBin)
  {
    var string = w2vLeeXun.GetNeighbors(v.join());
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
  }
  else
  {
    var model = {};
    for(var word in this.model) {
      var s = this.similarity(word, v)
      if(s) model[word] = s;
    }
    // let doo = {Derp: 17, Herp: 2, Asd: 5, Foo: 8, Qwe: 12};
    model = _.chain(model)
    .map((val, key) => {
      return { name: key, count: val }
    })
    .sortBy('count')
    .reverse()
    .keyBy('name')
    .mapValues('count')
    .value();
    if(returnType.toLowerCase() === 'object')
    {
      result = {};
      var iter = 0;
      for(var word in model) {
        result[word] = model[word];
        iter++;
        if(iter == N) break;
      }
    }
    else
    {
      result = [];
      var iter = 0;
      for(var word in model) {
        var tmp = {};
        tmp['word'] = word;
        tmp['cosineDistance'] = model[word];
        result.push(tmp);
        iter++;
        if(iter == N) break;
      }
    }
  }
  return result;
}
