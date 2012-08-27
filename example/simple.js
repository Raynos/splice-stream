var SpliceStream = require("../index")

var stream1 = SpliceStream()
    , stream2 = SpliceStream()

var list1 = stream1.createList()
    , list2 = stream2.createList()

list1.on("splice", function (args) {
    console.log("[LIST1]", args)
})

list2.on("splice", function (args) {
    console.log("[LIST2]", args)
})

stream2.pipe(stream1).pipe(stream2)

list1.push("foo")
list2.push("bar")

console.log("lengths", list1.length(), list2.length())