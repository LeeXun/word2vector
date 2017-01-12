'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var b = w2v.getNeighbors(w2v.getVector("臺灣"));
console.log(b);
