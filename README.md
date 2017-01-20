# word2vector NodeJS Interface
=============
This is a Node.js interface for Google's [word2vector](https://code.google.com/archive/p/word2vec/).<br>
Here is an [example](https://github.com/LeeXun/word2vector-Google3G) of how to load large model like [GoogleNews-vectors-negative300.bin](https://github.com/LeeXun/word2vector-Google3G) by this package.<br>
# Supports both binary model and raw text model.
# Warning: Windows is not supported.

# Installation
Linux, Unix OS are supported.
Install it via npm:
``` bash
npm install word2vector --save
```
In Node.js, require the module as below:
``` javascript
var w2v = require( 'word2vector' );
```
# API Document:
-----------
## Overview
[train](#w2vtrain-trainfile-modelfile-options-callback-)
[load](#w2vload-modelfile-)
[getVector](#w2vgetvectorwordword)
[getVectors](#w2vgetvectorswordsword1-word2-options--)
[getSimilarWords](#w2vgetsimilarwordsword--word-options--)
[getNeighbors](#getneighborsvector-options--)
[similarity](#w2vsimilarityword1--word1-word2--word2)
[substract](#w2vsubstractword1--word1-word2--word2)
[add](#w2vaddword1--word1-word2--word2)

-----------
### w2v.train( trainFile, modelFile, options, callback )
[Click here to see example TrainFile format.](https://github.com/LeeXun/word2vector/blob/master/data/train.data) <br>
Example:
``` javascript
var w2v = require("./lib");
var trainFile = "./data/train.data",
    modelFile = "./data/test.model.bin";
w2v.train(trainFile, modelFile, {
  	cbow: 1,           // use the continuous bag of words model //default
  	size: 10,          // sets the size (dimension) of word vectors // default 100
  	window: 8,         // sets maximal skip length between words // default 5
    binary: 1,         // save the resulting vectors in binary mode // default off
  	negative: 25,      // number of negative examples; common values are 3 - 10 (0 = not used) // default 5
  	hs: 0,             // 1 = use  Hierarchical Softmax // default 0
  	sample: 1e-4,      
  	threads: 20,
  	iter: 15,
  	minCount: 1,       // This will discard words that appear less than *minCount* times // default 5
    logOn: false       // sets whether any output should be printed to the console // default false
  });
```

### w2v.load( modelFile,?readType = "")
#####Should load model before call any calcuation functions.
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| readType        | Model format, pass "utf-8" if using a raw text model.  |     "bin"    |
Example:
``` javascript
var w2v = require("../lib");
var modelFile = "./test.model.bin";
w2v.load( modelFile );
// console.log(w2v.getSimilarWordsWords());
```

### w2v.getVector(word="word")
| Params        |   Description                | Default Value |
| ------------- |:-------------:| -----:|
| word          | String to be searched.       |     "word"    |
Example:
``` javascript
'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getVector("孫悟空"));
console.log(w2v.getVector("李洵"));
```
Sample Output:
``` javascript
// Array Type Only
[ 0.104406,
  -0.160019,
  -0.604506,
  -0.622804,
  0.039482,
  -0.120058,
  0.073555,
  0.05646,
  0.099059,
  -0.419282 ]

null // Return null if this word is not in model.
```

### w2v.getVectors(words=["word1", "word2"], ?options = {})
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| words          | Array of strings to be searched.       |     "word"    |
| options.returnType    | return Array or Object type             | Array         |
Example:
``` javascript
var w2v = require("./lib");  
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getVectors(["孫悟空", "李洵"]));
console.log(w2v.getVectors(["孫悟空", "李洵"], {returnType: "Object"}));
```
Sample Output:
``` javascript
// Array Type
[ { word: '孫悟空',
    vector:
     [ 0.104406,
       -0.160019,
       -0.604506,
       -0.622804,
       0.039482,
       -0.120058,
       0.073555,
       0.05646,
       0.099059,
       -0.419282 ] },
  { word: '李洵', vector: null } ]
  // this will trigger a error log in console:
  //'李洵' is not found in the model.
// Object Type
{ '孫悟空':
   [ 0.104406,
     -0.160019,
     -0.604506,
     -0.622804,
     0.039482,
     -0.120058,
     0.073555,
     0.05646,
     0.099059,
     -0.419282 ],
  '李洵': null }
  // this will trigger a error log in console:
  //'李洵' is not found in the model.
```
### w2v.getSimilarWords(word = "word", ?options = {})
#####Return 40ish words that is similar to "word".
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| word          | Strings to be searched.                 |     "word"    |
| options.N    | return topN results             | Array         |
| options.returnType    | return Array or Object type             | Array         |
Example:
``` javascript
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
console.log(w2v.getSimilarWords("唐三藏"));
console.log(w2v.getSimilarWords("李洵"));
console.log(w2v.getSimilarWords("唐三藏", {N:10, returnType: "Object"}));
console.log(w2v.getSimilarWords("李洵", {N:10, returnType: "Object"}));
```
Sample Output:
``` javascript
// Array Type
[ { word: '孫悟空', cosineDistance: 0.974369 },
  { word: '吳承恩', cosineDistance: 0.96686 },
  { word: '林黛玉', cosineDistance: 0.966664 },
  { word: '北地', cosineDistance: 0.96264 },
  { word: '賈寶玉', cosineDistance: 0.962137 },
  { word: '楚霸王', cosineDistance: 0.955795 },
  { word: '梁山泊', cosineDistance: 0.932804 },
  { word: '濮陽', cosineDistance: 0.927542 },
  { word: '黃天霸', cosineDistance: 0.927459 },
  { word: '英雄豪傑', cosineDistance: 0.921575 }]
// Return empty [] if this word is not in model.
'李洵' is not found in the model.
[]
// Object Type
{ '孫悟空': 0.974369,
  '吳承恩': 0.96686,
  '林黛玉': 0.966664,
  '北地': 0.96264,
  '賈寶玉': 0.962137,
  '楚霸王': 0.955795,
  '梁山泊': 0.932804,
  '濮陽': 0.927542,
  '黃天霸': 0.927459,
  '英雄豪傑': 0.921575}
// Return empty {} if this word is not in model.
'李洵' is not found in the model.
{}
```

### w2v.getSimilarAsync(word = "word", options, callback)
...........................Discarded.................................

### getNeighbors(vector, ?options = {})
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| vector        | Vector to be searched.                  |     "word"    |
| options.N    | return topN results             | Array         |
| options.returnType    | return Array or Object type             | Array         |
Example1:
``` javascript
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.getNeighbors(w2v.getVector("唐三藏"), {N: 9});
var b = w2v.getNeighbors(w2v.getVector("唐三藏"), {N: 9, returnType: "Object"});
// These are equal to use w2v.getSimilarWords("唐三藏");
console.log(a);
console.log(b);
```
Sample Output1:
``` javascript
[ { word: '唐三藏', cosineDistance: 0.9999993515200001 },
  { word: '孫悟空', cosineDistance: 0.974368825898 },
  { word: '吳承恩', cosineDistance: 0.966859435824 },
  { word: '林黛玉', cosineDistance: 0.966663471323 },
  { word: '北地', cosineDistance: 0.962639240211 },
  { word: '賈寶玉', cosineDistance: 0.9621371820049999 },
  { word: '楚霸王', cosineDistance: 0.9557946924850002 },
  { word: '梁山泊', cosineDistance: 0.9328033548890001 },
  { word: '濮陽', cosineDistance: 0.9275417727409999 } ]
{ '唐三藏': 0.9999993515200001,
  '孫悟空': 0.974368825898,
  '吳承恩': 0.966859435824,
  '林黛玉': 0.966663471323,
  '北地': 0.962639240211,
  '賈寶玉': 0.9621371820049999,
  '楚霸王': 0.9557946924850002,
  '梁山泊': 0.9328033548890001,
  '濮陽': 0.9275417727409999 }
```
Example2:
``` javascript
var w2v = require("../lib");
var modelFile = "./test.model.bin";
w2v.load( modelFile );
var a = w2v.getVectors(['唐三藏'], {returnType: "Object"})['唐三藏'];
var b = w2v.getVectors(['孫悟空'], {returnType: "Object"})['孫悟空'];
var c = [];
for(var i=0; i<a.length; i++) c.push(a[i] - b[i]);
var d = w2v.getNeighbors(c);
console.log(d);
// vector can do substractioin, while this didn't  mean anything. But you can create a vector by yourself.
```
Sample Output2:
``` javascript
[ { word: '蒙上帝', cosineDistance: 0.794216 },
  { word: '阿房宮賦', cosineDistance: 0.787006 },
  { word: '玄秘', cosineDistance: 0.770159 },
  { word: '檀香山', cosineDistance: 0.755662 },
  { word: '先賢祠', cosineDistance: 0.746278 },
  { word: '蘇萊曼', cosineDistance: 0.745826 },
  { word: '盧梭', cosineDistance: 0.704465 },
  { word: '夏威夷', cosineDistance: 0.700885 },
  { word: '伏爾泰', cosineDistance: 0.698588 },
  { word: '杜爾哥', cosineDistance: 0.688763 },
  { word: '祝你們', cosineDistance: 0.687257 } ... ...],
```
### w2v.similarity(word1 = "word1", word2 = "word2")
### w2v.similarity(vector1 = [], word2 = "word2")
### w2v.similarity(word1 = "word1", vector2 = [])
### w2v.similarity(vector1 = [], vector2 = [])
<pre>Compute the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) between the two vector.
Will auto search the vector of passed word in model. Return false if it's not found.</pre>
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| word1          | First Strings to be compared.       |     No default value    |
| word2    | Second Strings to be compared.            |     No default value    |
| vector1    | First Vector to be compared.            |     No default value    |
| vector2    | Second Vector to be compared.            |     No default value    |
Example:
``` javascript
'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.similarity("唐三藏", "孫悟空"); //  0.974368825898
console.log(a);
var b = w2v.similarity("唐三藏", "李洵"); //  0.974368825898
// same as var b = w2v.similarity("唐三藏", w2v.getVector("李洵"));
// same as var b = w2v.similarity(w2v.getVector("唐三藏"), "李洵");
// same as var b = w2v.similarity(w2v.getVector("唐三藏"), w2v.getVector("李洵"));
console.log(b);
```
Sample Output:
``` javascript
0.974368825898
// '李洵' is not found in the model. // error alert in console
false
```
### w2v.substract(word1 = "word1", word2 = "word2")
### w2v.substract(vector1 = [], word2 = "word2")
### w2v.substract(word1 = "word1", vector2 = [])
### w2v.substract(vector1 = [], vector2 = [])
<pre>Substract vector1 from vector2.
Will auto search the vector of passed word in model. Return false if it's not found.</pre>
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| word1          | Subtrahend       |     No default value    |
| word2    | Minuend            |     No default value    |
Example:
``` javascript
'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.substract("孫悟空", "孫悟空");
console.log(a);
```
Sample Output:
``` javascript
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
```
### w2v.add(word1 = "word1", word2 = "word2")
### w2v.add(vector1 = [], word2 = "word2")
### w2v.add(word1 = "word1", vector2 = [])
### w2v.add(vector1 = [], vector2 = [])
<pre>Add vector1 to vector2.
Will auto search the vector of passed word in model. Return false if it's not found.</pre>
| Params        |   Description                           | Default Value |
| ------------- |:-------------:| -----:|
| word1          | Summand       |     No default value    |
| word2    | Addend           |     No default value    |
Example:
``` javascript
'use strict';
var w2v = require("./lib");
var modelFile = "./data/test.model.bin";
w2v.load( modelFile );
var a = w2v.add("孫悟空", "孫悟空");
var b = w2v.getVector("孫悟空");
console.log(a);
console.log(b);
```
Sample Output:
``` javascript
[ 0.208812,
  -0.320038,
  -1.209012,
  -1.245608,
  0.078964,
  -0.240116,
  0.14711,
  0.11292,
  0.198118,
  -0.838564 ]
[ 0.104406,
  -0.160019,
  -0.604506,
  -0.622804,
  0.039482,
  -0.120058,
  0.073555,
  0.05646,
  0.099059,
  -0.419282 ]
```
