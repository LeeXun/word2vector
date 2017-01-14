var w2v = require("./index.js");

w2v.load( "./test/testdata/test.model", "utf-8");
console.log(w2v.getVectors(["孫悟空", "李洵"]));
console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));

w2v.load( "./test/testdata/test.model.bin" );
console.log(w2v.getVectors(["孫悟空", "李洵"]));
console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));
