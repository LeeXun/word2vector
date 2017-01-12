var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getSimilarWords("唐三藏"));
console.log(w2v.getSimilarWords("李洵"));
console.log(w2v.getSimilarWords("唐三藏", {N:10, returnType: "Object"}));
console.log(w2v.getSimilarWords("李洵", {N:10, returnType: "Object"}));
