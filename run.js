'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var test = [];

console.time("similarity");
console.time("loop");
for(var i=0; i<27000; i++)
  test.push("唐三藏");
console.timeEnd("loop");
w2v.getVectors(test);
console.timeEnd("similarity");
