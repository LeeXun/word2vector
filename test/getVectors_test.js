var should = require("should");
var w2v = require("../index.js");
var _ = require( "lodash" );
describe("getVectors", function() {
  var modelFile = __dirname + '/testdata/test.model';
  var modelFile_Bin = __dirname + '/testdata/test.model.bin';
  it('getVectors_test // utf-8', function() {
    w2v.load( modelFile, "utf-8");
    (_.isArray(w2v.getVectors(["孫悟空", "李洵"])[0]["vector"])).should.eql(true);
    (w2v.getVectors(["孫悟空", "李洵"])[1]["vector"]===null).should.eql(true);
  });

  it('getVectors_test // bin', function() {
    w2v.load( modelFile_Bin );
    (_.isArray(w2v.getVectors(["孫悟空", "李洵"])[0]["vector"])).should.eql(true);
    (w2v.getVectors(["孫悟空", "李洵"])[1]["vector"]===null).should.eql(true);
  });
});
