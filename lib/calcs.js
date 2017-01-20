var utils = require( './utils' );
var _ = require( 'lodash' );
var w2vLeeXun = utils.w2vLeeXun();
var w2v = {};
w2v.similarity = similarity;
w2v.add = add;
w2v.substract = substract;
module.exports = w2v;

function similarity(w1, w2, options = {})
{
  var logOn = false;
  if(options.hasOwnProperty("logOn")) logOn = true;
  var v1, v2;
  if(_.isArray(w1)) v1 = w1;
  else {
    v1 = this.getVector(w1);
    if(v1 === null)
    {
      console.error(v1);
      return false;
    }
  }
  if(_.isArray(w2)) v2 = w2;
  else {
    v2 = this.getVector(w2);
    if(v2 === null)
    {
      console.error(v2);
      return false;
    }
  }
  if(v1.length !== v2.length)
  {
    if(logOn)
    {
      console.error("Two vector's dimension is different:");
      console.error(v1);
      console.error(v2);
    }
    return false;
  }
  var sum = 0;
	for ( i = 0; i < v1.length; i++ ) {
		sum += v1[i] * v2[i];
	}
	return sum;
}

function add(w1, w2, options = {})
{
  var logOn = false;
  if(options.hasOwnProperty("logOn")) logOn = true;
  var v1, v2;
  if(_.isArray(w1)) v1 = w1;
  else {
    if(!this.model.hasOwnProperty(w1)) return false; // error log in getVector;
    v1 = this.model[w1];
  }
  if(_.isArray(w2)) v2 = w2;
  else {
    if(!this.model.hasOwnProperty(w2)) return false; // error log in getVector
    v2 = this.model[w2];
  }
  if(v1.length !== v2.length)
  {
    if(logOn)
    {
      console.error("Two vector's dimension is different:");
      console.error(v1);
      console.error(v2);
    }
    return false;
  }
  var result = [];
	for (var i = 0; i < v1.length; i++ ) {
		result.push(v1[i] + v2[i]);
	}
	return result;
}

function substract(w1, w2, options = {})
{
  var logOn = false;
  if(options.hasOwnProperty("logOn")) logOn = true;
  var v1, v2;
  if(_.isArray(w1)) v1 = w1;
  else {
    if(!this.model.hasOwnProperty(w1)) return false; // error log in getVector;
    v1 = this.model[w1];
  }
  if(_.isArray(w2)) v2 = w2;
  else {
    if(!this.model.hasOwnProperty(w2)) return false; // error log in getVector
    v2 = this.model[w2];
  }
  if(v1.length !== v2.length)
  {
    if(logOn)
    {
      console.error("Two vector's dimension is different:");
      console.error(v1);
      console.error(v2);
    }
    return false;
  }
  var result = [];
	for ( i = 0; i < v1.length; i++ ) {
		result.push(v1[i] - v2[i]);
	}
	return result;
}

function similarity2(w1, w2, options)
{
  var logOn = false;
  if(options.hasOwnProperty("logOn")) logOn = true;
  var v1 = this.model[w1];
  var v2 = this.model[w2];
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

function oldSimilarity(w1, w2)
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
