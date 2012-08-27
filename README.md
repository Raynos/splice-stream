# splice-stream

Stream changes to an array

## Data protocol

`[[/* Array.prototype.splice arguments */], timestamp, sourceIdentifier]`

A splice-stream emits an array, where the first value is an array of parameters compatible with `Array.prototype.slice`. This represents the delta in change on an array.

The second value is a time stamp which can be used for clever synchronization. 

The third value is a source identifier. It's used to identify who created this splice

## Example

``` js
var SpliceStream = require("splice-stream")

var stream1 = SpliceStream()
    , stream2 = SpliceStream()

var list1 = stream1.createList()
    , list2 = stream2.createList()

list1.on("add", function (item) {
    console.log("[LIST1]", item)
})

list2.on("remove", function (item) {
    console.log("[LIST2]", item)
})

stream2.pipe(stream1).pipe(stream2)

list2.push("bar") // [LIST1] bar

console.log("lengths", list1.length(), list2.length()) // lengths 1 1

list1.shift() // [LIST2] bar
```

## Installation

`npm install splice-stream`

## Contributors

 - Raynos

## MIT Licenced