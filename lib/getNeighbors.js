'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );
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
  return result;
}


function oldgetNeighbors(v, returnType = "array")
{
  var result = [];
  var ts = v, t, s;
  this.checkModelFile();
  if(v === null)
  {
    return false;
  }
  if(!_.isArray(v))
  {
    throw new Error("First para is not an vector array.")
  }
  if(!_.isArray(ts))
	{
    t = this.getVector("臺灣", "Object");
    ts = t[Object.keys(t)[0]].join();
    console.log(ts);
	}
  var child;
  if(this.mime === 'text/plain') child = spawnSync('./getNeighbors', ['-f', this.modelFile, '-v', ts], {cwd: utils.SRC_DIR});
  else child = spawnSync('./getNeighbors', ['-f', this.modelFile, '-v', ts, '-b', 0], {cwd: utils.SRC_DIR});

	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getNeighbors.');
	  throw new Error(errorText);
	}
	else {
	  var stdout = child.stdout.toString().trim();
    // console.log(stdout);
    var lines = stdout.split('\n');
    lines.pop(1); // pop this last after splitting
    if(returnType.toLowerCase() === 'object')
    {
      result = {};
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        result[s[0]] = parseFloat(s[1]);
      })
    }
    else
    {
      result = [];
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        tmp['word'] = s[0];
        tmp['cosineDistance'] = parseFloat(s[1]);
        result.push(tmp);
      });
    }
    return result;
	}
}
