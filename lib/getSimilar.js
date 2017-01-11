var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );

var w2v = {};
w2v.getSimilar = getSimilarSync;
w2v.getSimilarSync = getSimilarSync;
module.exports = w2v;

function getSimilarSync(word = "臺灣", returnType = "array")
{
  var result = [];
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawnSync('./getSimilar', ['-f', this.modelFile, '-w', word], {cwd: utils.SRC_DIR});
	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getSimilar.');
	  throw new Error(errorText);
	}
	else {
	  var stdout = child.stdout.toString().trim();
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
    if(_.isArray(result) && result.length === 0)
    {
      console.log("\'%s\' is not found in the model.", word);
    }
    else if(_.isObject(result) && Object.keys(result).length === 0)
    {
      console.log("\'%s\' is not found in the model.", word);
    }
    return result;
	}
}
