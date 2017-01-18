var should = require("should");
var w2v = require("../index.js");
var _ = require( "lodash" );
describe("getVector_test", function() {
  var modelFile = __dirname + '/testdata/test.model';
  var modelFile_Bin = __dirname + '/testdata/test.model.bin';
  it('getVector_test // utf-8', function() {
    w2v.load( modelFile, "utf-8");
    (_.isArray(w2v.getVector("臺灣"))).should.eql(true);
    (w2v.getVector("李洵") === null).should.eql(true);
  });

  it('getVector_test // bin', function() {
    w2v.load( modelFile_Bin );
    (_.isArray(w2v.getVector("臺灣"))).should.eql(true);
    (w2v.getVector("李洵") === null).should.eql(true);
  });
});
