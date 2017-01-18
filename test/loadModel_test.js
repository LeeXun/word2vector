var should = require("should");
var w2v = require("../index.js");

describe("w2v.load()", function() {
  var modelFile = __dirname + '/testdata/test.model';
  var modelFile_Bin = __dirname + '/testdata/test.model.bin';
  it('w2v.load( \'/testdata/test.model\' )', function() {
    w2v.load( modelFile, "utf-8").should.eql(true);
  });
  it('w2v.load( \'/testdata/test.model.bin\' )', function() {
    w2v.load( modelFile_Bin ).should.eql(true);
  });
});
