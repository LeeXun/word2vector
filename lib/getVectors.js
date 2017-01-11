'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );
var w2v = {};
w2v.getVector = getVector;
w2v.getVectors = getVectors;
module.exports = w2v;

function getVector(word = "臺灣", returnType = "array")
{
  return this.getVectors([word], "array")[0]['vector'];
}

function getVectors(words, returnType = "array")
{
  var result = [];
  this.checkModelFile();
  if(!_.isArray(words))
	{
		throw new Error("param1 is not a array.");// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  if(returnType.toLowerCase() === 'object')
  {
    result = {};
    words.map( (w, i) => {
      if(this.model[w] === undefined)
      {
        this.model[w] = null;
      }
      result[w] = this.model[w];
    });
  }
  else
  {
    words.map( (w, i) => {
      if(this.model[w] === undefined)
      {
        this.model[w] = null;
      }
      var t = {
        word: w,
        vector: this.model[w]
      }
      result.push(t);
    });
  }
  return result;
}
// I was using spaqn to run exec, but this really costs too much to function calls and
// transaction between nodejs and callback;
//
// function getVectors(words = ["臺灣","荷蘭","德國"], returnType = "array")
// {
//   var result = [];
  // if(!_.isArray(words))
	// {
	// 	throw new Error("param1 is not a array.");// `${data}`  //`.......   exitCode: ${exitCode}`
	// }
//   this.checkModelFile();
//   var wordsString = words.join();
//   var child;
//   if(this.mime === 'text/plain') child = spawnSync('./getVectors', ['-f', this.modelFile, '-w', wordsString], {cwd: utils.SRC_DIR});
//   else child = spawnSync('./getVectors', ['-f', this.modelFile, '-w', wordsString, '-r', 0], {cwd: utils.SRC_DIR});
// 	var errorText = child.stderr.toString().trim();
// 	if (errorText) {
// 	  throw new Error(errorText);
// 	}
// 	else {
// 	  var stdout = child.stdout.toString().trim();
//     var lines = stdout.split('\n'); // 要確認一下為神魔不用 pop
//     if(returnType.toLowerCase() === 'object')
//     {
//       result = {};
//       lines.map((l, i) => {
//         var tmp = {};
//         var s = l.split(',');
//         var key = s.shift();
//         if(s.length === 10)
//           for(var j=0; j<s.length; j++) s[j] = parseFloat(s[j]);
//         else
//         {
//           console.error("\'%s\' is not found in the model.", key);
//           s = null;
//         }
//         result[key] = s;
//       })
//     }
//     else
//     {
//       result = [];
//       lines.map((l, i) => {
//         var tmp = {};
//         var s = l.split(',');
//         tmp['word'] = s.shift(s);
//         if(s.length === 10)
//           for(var j=0; j<s.length; j++) s[j] = parseFloat(s[j]);
//         else
//         {
//           console.error("\'%s\' is not found in the model.", tmp['word']);
//           s = null;
//         }
//         tmp['vector'] = s;
//         result.push(tmp);
//       })
//     }
//     return result;
// 	}
// }
