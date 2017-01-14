var should = require("should");
var w2v = require("../index.js");

describe("w2v.load()", function() {
  var modelFile = __dirname + '/testdata/test.model';
  var modelFile_Bin = __dirname + '/testdata/test.model.bin';
  it('w2v.getVector( \'臺灣\' ) // utf-8', function() {
    w2v.load( modelFile, "utf-8");
    w2v.getVectors(["孫悟空", "李洵"]).should.eql([
      {
        word: '孫悟空',
        vector: [
           0.35405453102778217,
           -0.13020556700427177,
           0.3486795739074,
           -0.3521704608644491,
           -0.3055829936498513,
           0.32583007206652137,
           -0.15426232430239037,
           0.03179117026434069,
           -0.24421538336741178,
           0.5727962308395066
         ]
      },
      {
        word: '李洵',
        vector: null
      }
    ]);
    w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}).should.eql(
      {
        '孫悟空': [
         .35405453102778217,
         -0.13020556700427177,
         0.3486795739074,
         -0.3521704608644491,
         -0.3055829936498513,
         0.32583007206652137,
         -0.15426232430239037,
         0.03179117026434069,
         -0.24421538336741178,
         0.5727962308395066
       ],
        '李洵': null
      });
  });

  it('w2v.getVector( \'臺灣\' ) // bin', function() {
    w2v.load( modelFile_Bin );
    w2v.getVectors(["孫悟空", "李洵"]).should.eql([
      {
        word: '孫悟空',
        vector: [
           -0.128402,
           0.442746,
           -0.698689,
           -0.175617,
           0.036717,
           -0.311772,
           0.10084,
           0.35206,
           -0.046738,
           -0.18339
         ]
       },
       {
         word: '李洵',
         vector: null
       }
     ]);
    w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}).should.eql(
      {
        '孫悟空': [
          -0.128402,
           0.442746,
           -0.698689,
           -0.175617,
           0.036717,
           -0.311772,
           0.10084,
           0.35206,
           -0.046738,
           -0.18339
         ],
         '李洵': null
       });
  });
});
