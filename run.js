'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.similarity("唐三藏", "孫悟空");
console.log(a);
