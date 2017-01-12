var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var spawnSync = require( 'child_process' ).spawnSync;
var utils = require( './utils' );

var w2v = {};
w2v.getSimilarWords = getSimilarWords;
module.exports = w2v;

function getSimilarWords(sword = "臺灣", options = {})
{
  var returnType = "array", N = 40;
  if(options.hasOwnProperty("returnType")) returnType = options.returnType;
  if(options.hasOwnProperty("N")) N = options.N;
  var result = [];
  if(!_.isString(sword) || this.model[sword] === undefined)
	{
		console.log("\'%s\' is not found in the model.", sword);
	}
  this.checkModelFile();
  var model = {};
  for(var word in this.model) {
    var s = this.similarity(word, sword)
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
  // console.log(model);
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

function oldgetSimilarWords(word = "臺灣", returnType = "array")
{
  var result = [];
  if(!_.isString(word))
	{
		word = "臺灣";// `${data}`  //`.......   exitCode: ${exitCode}`
	}
  this.checkModelFile();
  var child = spawnSync('./getSimilarWords', ['-f', this.modelFile, '-w', word], {cwd: utils.SRC_DIR});
	var errorText = child.stderr.toString().trim();
	if (errorText) {
	  console.log('Fatal error from ./getSimilarWords.');
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
