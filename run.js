'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
// var a = w2v.add("孫悟空", "孫悟空");
var b = w2v.getSimilar("孫悟空");
// console.log(a);
console.log(b);
