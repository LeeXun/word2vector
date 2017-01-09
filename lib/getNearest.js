'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var execSync = require( 'child_process' ).execSync;
var changeCase = require( 'change-case' );
var utils = require( './utils' );

module.exports = getNearestSync;

function getNearestSync(word = "臺灣", returnType = "object")
{
  var result = [];
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var stdout = execSync('./getNearest -f '+this.modelFile+' -w '+word, {cwd: utils.SRC_DIR, encoding: 'utf-8'});
  var lines = stdout.split('\n');
  lines.pop(1); // pop this last after splitting
  if(returnType === 'object')
  {
    result = {};
    lines.map((l, i) => {
      var tmp = {};
      var s = l.split(',');
      result[s[0]] = s[1];
    })
  }
  else
  {
    result = [];
    lines.map((l, i) => {
      var tmp = {};
      var s = l.split(',');
      tmp['word'] = s[0];
      tmp['cosineDistance'] = s[1];
      result.push(tmp);
    })
  }
  console.log(result);
  return result;
}

function getNearestAsync(word = "臺灣")
{
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawn( './getNearest',
		[
      '-f', this.modelFile,
      '-w', word
    ],
		{ cwd: utils.SRC_DIR }
	);
	child.stdout.on( 'data', (data) => {
    c1(data);
    // console.log(`${data}`);
	});
	child.on( 'close', (exitCode) => {
    c2(exitCode);
    // console.log(`.......   exitCode: ${exitCode}`);
	});
}
