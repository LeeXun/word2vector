'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var changeCase = require( 'change-case' );
var utils = require( './utils' );
var w2v = {};

w2v.getNearests = getNearestsSync;
w2v.getNearestsSync = getNearestsSync;
w2v.getNearestsAsync = getNearestsAsync;
module.exports = w2v;

function getNearestsSync(v, returnType = "array")
{
  var result = [];
  var ts = v, t, s;
  this.checkModelFile();
  if(!_.isArray(ts))
	{
    t = this.getVector("臺灣", "Object");
    ts = t[Object.keys(t)[0]].join();
    console.log(ts);
	}
  var child;
  if(this.mime === 'text/plain') child = spawnSync('./getNearests', ['-f', this.modelFile, '-v', ts], {cwd: utils.SRC_DIR});
  else child = spawnSync('./getNearests', ['-f', this.modelFile, '-v', ts, '-b', 0], {cwd: utils.SRC_DIR});

	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getNearests.');
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

function getNearestsAsync(word = "臺灣", callback)
{
  var result = {};
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawn( './getNearests',
		[
      '-f', this.modelFile,
      '-w', word
    ],
		{ cwd: utils.SRC_DIR }
	);
  child.stdout.on( 'error', (err) => {
    console.log('Fatal error from ./getNearests.');
    result = err;
	  // throw new Error(err.toString.trim());
	});
	child.stdout.on( 'data', (data) => {
    var stdout = data.toString().trim();
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
      })
    }
	});
	child.on( 'close', (exitCode) => {
    callback(result, exitCode);
    // console.log(`.......   exitCode: ${exitCode}`);
	});
}
