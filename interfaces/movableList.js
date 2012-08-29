var ReEmitter = require("re-emitter")
    , EventEmitter = require("events").EventEmitter
    , extend = require("xtend")
    , List = require("./list")

module.exports = MovableList

function MovableList(list) {
    if (!list) {
        list = List()
    }

    // Support a stream as an argument
    if (list.createList) {
        list = list.createList()
    }

    var movableList = ReEmitter(list, ["splice"])
        , removeBuffer = []
        , clearing = false

    extend(movableList, list, {
        _events: {}
    })

    list.on("add", onadd)

    list.on("remove", onremove)

    return movableList

    function onadd(item, newIndex) {
        var data = removeBuffer.filter(findItem, { item: item })[0]

        if (!data) {
            movableList.emit("add", item, newIndex)
        } else {
            movableList.emit("move", item, newIndex, data.oldIndex)
        }
    }

    function onremove(item, oldIndex) {
        removeBuffer.push({
            item: item
            , oldIndex: oldIndex
        })

        if (!clearing) {
            clearing = true
            process.nextTick(clear)
        }
    }

    function findItem(data) {
        if (data.item === this.item) {
            return true
        }
    }

    function clear() {
        removeBuffer.forEach(emit)
        removeBuffer = []
        clearing = false
    }

    function emit(data) {
        movableList.emit("remove", data.item, data.oldIndex)
    }
}