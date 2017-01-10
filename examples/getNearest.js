'use strict';
var w2v = require("../lib");
var modelFile = "./test.model.bin";
w2v.load( modelFile );
console.log(w2v.getNearests()); // default word is taiwan
