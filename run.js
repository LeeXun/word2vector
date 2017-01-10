'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
// var w2v = new Word2Vector( modelFile );
w2v.load( modelFile );
// var a = w2v.getVectors(['臺灣',"中國","日本"]);
var a = w2v.getNearests();
console.log(a);
