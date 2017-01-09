'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var changeCase = require( 'change-case' );
var utils = require( './utils' );
var w2v = {};
w2v.getVectors = getVectors;
module.exports = w2v;
function getVector(word, returnType)
{
  this.getVectors([word], returnType);
}
function getVectors(words = ["臺灣","荷蘭","德國"], returnType = "object")
{
  var result = [];
  if(!_.isArray(words))
	{
		word = ["臺灣","德國","荷蘭","荷蘭","荷蘭"];// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var wordsString = words.join();
  var child = spawnSync('./getVectors', ['-f', this.modelFile, '-w', wordsString], {cwd: utils.SRC_DIR});
	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getVectors.');
	  throw new Error(errorText);
	}
	else {
	  var stdout = child.stdout.toString().trim();
    var lines = stdout.split('\n'); // 要確認一下為神魔不用 pop
    if(returnType === 'object')
    {
      result = {};
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        result[s.shift()] = s;
      })
    }
    else
    {
      result = [];
      lines.map((l, i) => {
        var tmp = {};
        var s = l.split(',');
        tmp['word'] = s[0];
        tmp['vector'] = s[1];
        result.push(tmp);
      })
    }
    return result;
	}
}
