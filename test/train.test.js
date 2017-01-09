var train = require("../lib/train");
var utils = require("../lib/utils");
var trainFile = utils.TESTDATA_DIR + "train.data",
    modelFile = utils.TESTDATA_DIR + "test.model";

train(trainFile, modelFile, {
	cbow: 1,
	size: 10,
	window: 8,
	negative: 25,
	hs: 0,
	sample: 1e-4,
	threads: 20,
	iter: 15,
	minCount: 1,
  logOn: false
});
