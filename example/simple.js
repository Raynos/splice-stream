var SpliceStream = require("../index")

var stream1 = SpliceStream()
    , stream2 = SpliceStream()

var list1 = stream1.createList()
    , list2 = stream2.createList()

list1.on("add", function (item, index) {
    console.log("[LIST1]", item, index)
})

list2.on("remove", function (item) {
    console.log("[LIST2]", item)
})

stream2.pipe(stream1).pipe(stream2)

list2.push("bar")

console.log("lengths", list1.length(), list2.length())

list1.shift()