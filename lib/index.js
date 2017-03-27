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
  load: function( modelFile, fileType = "bin") {
    if (  !_.isString(modelFile) ) throw new TypeError( 'load(): param 1 must be string.' )
    this.modelFile = path.resolve( process.cwd(), modelFile)
    fs.access(this.modelFile, (err) => {
      if (err) {
        if (err.code === "ENOENT") throw new Error('modelFile does not exist')
        else throw err
      }
    })
    w2v.load(this.modelFile, fileType)
    return true
  },
  getVector: function(word = '臺灣') {
    if(!_.isString(word)) throw new Error('getVector(): param1 is not a string.')
    return this.getVectors([word])[0]['vector']
  },
  getVectors: function(words = ['臺灣']) {
    if(!_.isArray(words)) throw new Error('getVectors(): param1 is not an array.')
    return w2v.getVectors(words)
  },
  getNeighbors: function(vectors) {
    if(!_.isArray(vectors)) throw new Error('getNeighbors(): param1 is not an array.')
    return w2v.getNeighbors(vectors)
  },
  getSimilarWords: function(word) {
    if(!_.isString(word)) throw new Error('getSimilarWords(): param1 is not a string.')
    return w2v.getSimilarWords(word)
  },
  bin2txt: function( binFile ) {
    if (!_.isString( binFile )) throw new TypeError( 'load(): param 1 must be string.' )
    w2v.bin2txt( binFile )
    return true
  },
  similarity: calcs.similarity,
  add: calcs.add,
  substract: calcs.substract
}