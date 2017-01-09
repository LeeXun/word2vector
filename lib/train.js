'use strict';
var path = require( 'path' );
var _ = require( 'lodash' );
var spawn = require( 'child_process' ).spawn;
var changeCase = require( 'change-case' );
var utils = require( './utils' );

module.exports = train;

function train( trainFile, modelFile, options, callback ) {
	var options = options || {},
			argsArray = [],
			name,
      logOn = options.logOn || true;

	if ( callback === undefined )
	{
		callback = () => {};
	}
	if(!_.isString(trainFile))
	{
		throw new TypeError( 'train(): param 1 must be string.' );
	}
	if(!_.isString(modelFile))
	{
		throw new TypeError( 'train(): param 2 must be string.' );
	}

	var trainFile = path.resolve( process.cwd(), trainFile);
	var modelFile = path.relative( utils.SRC_DIR, modelFile );

	for (var o in options ) {
		if ( options[o] && o !== 'logOn' ) {
			var po = changeCase.param( o );
			argsArray.push( '-' + po );
			argsArray.push( options[po] );
		}
	}

	var child = spawn( './word2vec',
		['-train', trainFile,
		'-output', modelFile ].concat(argsArray),
		{ cwd: utils.SRC_DIR }
	);

	child.stdout.on( 'data', (data) => {
		if ( logOn ) {
      console.log(`.......   ${data}`);
		}
	});

	child.on( 'close', (exitCode) => {
		if ( logOn ) {
      console.log(`.......   exitCode: ${exitCode}`);
		}
		callback( exitCode );
	});

} // end of train()

/*
Parameters for training:
	-train <file>
		Use text data from <file> to train the model
	-output <file>
		Use <file> to save the resulting word vectors / word clusters
	-size <int>
		Set size of word vectors; default is 100
	-window <int>
		Set max skip length between words; default is 5
	-sample <float>
		Set threshold for occurrence of words. Those that appear with higher frequency in the training data
		will be randomly down-sampled; default is 1e-3, useful range is (0, 1e-5)
	-hs <int>
		Use Hierarchical Softmax; default is 0 (not used)
	-negative <int>
		Number of negative examples; default is 5, common values are 3 - 10 (0 = not used)
	-threads <int>
		Use <int> threads (default 12)
	-iter <int>
		Run more training iterations (default 5)
	-min-count <int>
		This will discard words that appear less than <int> times; default is 5
	-alpha <float>
		Set the starting learning rate; default is 0.025 for skip-gram and 0.05 for CBOW
	-classes <int>
		Output word classes rather than word vectors; default number of classes is 0 (vectors are written)
	-debug <int>
		Set the debug mode (default = 2 = more info during training)
	-binary <int>
		Save the resulting vectors in binary moded; default is 0 (off)
	-save-vocab <file>
		The vocabulary will be saved to <file>
	-read-vocab <file>
		The vocabulary will be read from <file>, not constructed from the training data
	-cbow <int>
		Use the continuous bag of words model; default is 1 (use 0 for skip-gram model)
*/
