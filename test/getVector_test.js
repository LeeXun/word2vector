var should = require("should");
var w2v = require("../index.js");

describe("w2v.load()", function() {
  var modelFile = __dirname + '/testdata/test.model';
  var modelFile_Bin = __dirname + '/testdata/test.model.bin';
  it('w2v.getVector( \'臺灣\' ) // utf-8', function() {
    w2v.load( modelFile, "utf-8");
    w2v.getVector("臺灣").should.eql([
      -0.5630067344328391,
      0.43179305602752016,
      -0.25948232532031346,
      -0.35688019566013307,
      0.02933843479446003,
      0.3732002320776698,
      0.04333302778776004,
      -0.1490537660585023,
      -0.02720168738568294,
      0.3700131852954868
    ]);
    (w2v.getVector("李洵") === null).should.eql(true);
  });

  it('w2v.getVector( \'臺灣\' ) // bin', function() {
    w2v.load( modelFile_Bin );
    w2v.getVector("臺灣").should.eql([
      -0.038386,
      -0.401017,
      -0.483565,
      -0.662807,
      0.037017,
      -0.014108,
      0.096808,
      0.031274,
      -0.043704,
      -0.388245
    ]);
    (w2v.getVector("李洵")===null).should.eql(true);
  });
});
