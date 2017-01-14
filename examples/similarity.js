'use strict';
var w2v = require("./lib");

w2v.load( "./data/test.model.bin" );
var a = w2v.similarity("唐三藏", "孫悟空"); //  0.974368825898
console.log(a);
var b = w2v.similarity("唐三藏", "李洵"); //  0.974368825898
console.log(b);
