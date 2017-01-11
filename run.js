'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
w2v.getSimilar("李洵a");
// console.log(w2v.getSimilar("唐三藏"));
// console.log(w2v.getSimilar("李洵a"));
// console.log(w2v.getSimilar("唐三藏", "object"));
// console.log(w2v.getSimilar("李洵", "object"));

function similarity(w1, w2)
{
  var v1 = this.getVector(w1);
  var v2 = this.getVector(w2);
  if(v1 === null)
  {
    return 0;
  }
  if(v2 === null)
  {
    return 0;
  }
  sum = 0;
	for ( i = 0; i < size; i++ ) {
		sum += vecs[0][i] * vecs[1][i];
	}
	return sum;
}
