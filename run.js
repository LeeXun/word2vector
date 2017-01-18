var w2v = require("./index.js");
var _ = require( "lodash" );
// w2v.load( "./test/testdata/test.model", "utf-8");
// console.log(w2v.getVectors(["孫悟空", "李洵"]));
// console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));
//
w2v.load( "./test/testdata/test.model.bin");
console.log(_.isArray(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"})["孫悟空"]));
console.log(w2v.getVector("孫悟空"));
console.log(w2v.getVector("李洵"));
// console.log(w2v.model["臺灣"]);
// console.log(_.isArray(w2v.getVector("臺灣")))
// console.log(w2v.getVectors(["孫悟空", "李洵"]));
// console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));
// console.log(w2v.similarity(w2v.getVector("臺灣"), "臺灣"));
// console.log(w2v.getVector("李洵"));
// console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"})['孫悟空'].length);
// console.log(w2v.getVectors(["孫悟空", "李洵"]));
// console.log(w2v.getSimilarWords("唐三藏"));
// console.log(w2v.getNeighbors(w2v.getVector("孫悟空")));
console.log(w2v.similarity("唐三藏",w2v.getVector("唐三藏")));

// console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));
// console.time("similarity");
// w2v.similarity("孫悟空", "李洵");
// console.timeEnd("similarity");

// 動機
// 文本？
// 考卷
// 測驗結果
//
