function w2v() {
  try {
    return require('../build/Release/w2vLeeXun.node');
  } catch (err) {
    return require('../build/Debug/w2vLeeXun.node');
  }
}
var w = w2v()
w.getVector = function (word = "臺灣") {
  return this.getVectors([word], "array")[0]['vector'];
}

module.exports = w