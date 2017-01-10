var train = require("../lib/train");
var w2v = require("./lib");
var trainFile = "../data/train.data",
    modelFile = "./data/test.model.bin";
train(trainFile, modelFile, {
  	cbow: 1,
  	size: 10,
  	window: 8,
    binary: 1,
  	negative: 25,
  	hs: 0,
  	sample: 1e-4,
  	threads: 20,
  	iter: 15,
  	minCount: 1,
    logOn: false
  });
