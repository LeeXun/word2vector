var utils = require( './utils' );
var w2v = {};
w2v.similarity = similarity;
module.exports = w2v;

function similarity(w1, w2)
{
  var v1 = this.getVector(w1);
  var v2 = this.getVector(w2);
  if(v1 === null)
  {
    return false; // error log in getVector
  }
  if(v2 === null)
  {
    return false; // error log in getVector
  }
  if(v1.length !== v2.length)
  {
    console.error("Two vector's dimension is different.")
    return false;
  }
  var sum = 0;
	for ( i = 0; i < v1.length; i++ ) {
		sum += v1[i] * v2[i];
	}
	return sum;
}
