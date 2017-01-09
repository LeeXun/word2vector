'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.getVectors(); // default word is taiwan
console.log(a);
