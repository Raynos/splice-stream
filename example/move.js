var MovableList = require("../index").MovableList

var list1 = MovableList()

list1.on("move", function (item, index, old) {
    console.log("[MOVE]", item, index, old)
})

list1.on("add", function (item, index) {
    console.log("[ADD]", item, index)
})

list1.push("bar")
list1.push("foo")

process.nextTick(function () {
    var elem = list1.pop()
    list1.unshift(elem)
})