'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );
var w2v = {};

w2v.getNeighbors = getNeighbors;
module.exports = w2v;

function getNeighbors(v, returnType = "array")
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
