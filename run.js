'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getVector("孫悟空"));
console.log(w2v.getVector("李洵"));
function similarity(w1, w2)
{
  var v1 = this.getVector(w1);
  var v2 = this.getVector(w2);
  sum = 0;
	for ( i = 0; i < size; i++ ) {
		sum += vecs[0][i] * vecs[1][i];
	}
	return sum;
}
