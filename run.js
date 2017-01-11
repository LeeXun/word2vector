// 'use strict';
// var w2v = require("./lib");
// var modelFile = "./data/test.model.bin";
// // var w2v = new Word2Vector( modelFile );
// w2v.load( modelFile );
// var a = w2v.getVector('唐三藏');
// // var b = w2v.getVectors(['孫悟空'], "Object")['孫悟空'];
// // var c = [];
// // for(var i=0; i<a.length; i++) c.push(a[i] - b[i]);
// var d = w2v.getNearest(a);
// console.log(d);
var w2v = require("./lib");  //  過年之前  web 前端 實習工程師 6/30 170 hour
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getVectors(["唐三藏", "孫悟空"], "Object"));
