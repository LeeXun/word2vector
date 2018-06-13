'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const train = require('./train')
const calcs = require('./calcs')
function w2v() {
  try {
    return require('../build/Release/w2vLeeXun.node')
  } catch (err) {
    return require('../build/Debug/w2vLeeXun.node')
  }
}
var w2v = w2v()
module.exports = {
  train: train,
  load: function (modelFile, fileType = "bin") {
    if (!_.isString(modelFile)) throw new TypeError('load(): param 1 must be string.')
    this.modelFile = path.resolve(process.cwd(), modelFile)
    fs.access(this.modelFile, (err) => {
      if (err) {
        if (err.code === "ENOENT") throw new Error('modelFile does not exist')
        else throw err
      }
    })
    w2v.load(this.modelFile, fileType)
    return true
  },
  getVector: function (word = '臺灣') {
    if (!_.isString(word)) throw new Error('getVector(): param1 is not a string.')
    return this.getVectors([word])[0]['vector']
  },
  getVectors: function (words = ['臺灣']) {
    if (!_.isArray(words)) throw new Error('getVectors(): param1 is not an array.')
    return w2v.getVectors(words)
  },
  getNeighbors: function (vectors) {
    if (!_.isArray(vectors)) throw new Error('getNeighbors(): param1 is not an array.')
    return w2v.getNeighbors(vectors)
  },
  getSimilarWords: function (word, options = {}) {
    if (!_.isString(word))
      throw new Error('getSimilarWords(): param1 is not a string.');

    // Leave default value unchanged
    let topN = 40;

    // Check if we have a proper type for top N
    if (options.N) {
      if (!_.isInteger(options.N))
        throw new Error('getSimilarWords(): param2 is not an integer');

      topN = options.N > 1000 ? 1000 : options.N;
    }

    return w2v.getSimilarWords(word, topN.toString());
  },
  bin2txt: function (binFile) {
    if (!_.isString(binFile)) throw new TypeError('load(): param 1 must be string.')
    w2v.bin2txt(binFile)
    return true
  },
  similarity: calcs.similarity,
  add: function (p1, p2, opt = {}) {
    var v1, v2;
    if (_.isArray(p1)) v1 = p1;
    else v1 = w2v.getVectors([p1])[0]['vector'];
    if (_.isArray(p2)) v2 = p2;
    else v2 = w2v.getVectors([p2])[0]['vector'];
    if (v1.length !== v2.length) {
      console.error("Two vector's dimension is different:");
      console.error(v1);
      console.error(v2);
      return false;
    }
    else {
      return calcs.add(v1, v2);
    }
  },
  substract: function (p1, p2, opt = {}) {
    var v1, v2;
    if (_.isArray(p1)) v1 = p1;
    else v1 = w2v.getVectors([p1])[0]['vector'];
    if (_.isArray(p2)) v2 = p2;
    else v2 = w2v.getVectors([p2])[0]['vector'];
    if (v1.length !== v2.length) {
      console.error("Two vector's dimension is different:");
      console.error(v1);
      console.error(v2);
      return false;
    }
    else {
      return calcs.substract(v1, v2);
    }
  }
}
