'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.add("孫悟空", [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
console.log(w2v.getVector("孫悟空"));
console.log(a);
