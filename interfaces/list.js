var SpliceStream = require("../index")
    , uuid = require("node-uuid")
    , EventEmitter = require("events").EventEmitter
    , slice = Array.prototype.slice

List.createStream = createStream

module.exports = List

/*
    Events:
      - add <item>
      - remove <item>
      - splice <args, source>
*/
function List(stream) {
    var list = new EventEmitter()
        , state = []

    list.indexOf = indexOf
    list.lastIndexOf = lastIndexOf
    list.at = at
    list.unshift = unshift
    list.push = push
    list.splice = splice
    list.spliceWithSource = spliceWithSource
    list.length = _length
    list.pop = pop
    list.shift = shift
    list.remove = remove
    list.toJSON = toJSON
    list.createStream = returnStream
    list.sync = sync

    if (stream) {
        list.id = stream.id
        bind(list, stream)
    } else {
        list.id = uuid()
        stream = createStream(list)
    }

    return list

    function indexOf(item, fromIndex) {
        return state.indexOf(item, fromIndex)
    }

    function lastIndexOf(item, fromIndex) {
        return state.lastIndexOf(item, fromIndex)
    }

    function at(index) {
        return state[index]
    }

    function unshift() {
        var args = slice.call(arguments)
        args.unshift(0, 0)
        splice.apply(null, args)

        return state.length
    }

    function push() {
        var args = slice.call(arguments)
        args.unshift(state.length, 0)
        splice.apply(null, args)

        return state.length
    }

    function spliceWithSource(args, source) {
        var index = args[0]
            , howMany = args[1]
            , items = args.slice(2)
            , removed = state.slice(index, index + howMany)
            , item

        var result = state.splice.apply(state, args)

        list.emit("splice", args, source)

        for (var j = 0; j < removed.length; j++) {
            item = removed[j]

            list.emit("remove", item, index + j)
        }

        for (var i = 0; i < items.length; i++) {
            item = items[i]
            
            list.emit("add", item, state.indexOf(item))
        }

        return result
    }

    function splice(index, howMany) {
        var args = slice.call(arguments)
        return spliceWithSource(args, list.id)
    }

    // length is a global variable -.-
    function _length() {
        return state.length
    }

    function pop() {
        var lastIndex = state.length - 1
            , last = state[lastIndex]

        splice(lastIndex, 1)

        return last
    }

    function shift() {
        var first = state[0]

        splice(0, 1)

        return first
    }

    function remove(item) {
        var index = indexOf(item)

        return splice(index, 1)
    }

    function toJSON() {
        return state
    }

    function returnStream() {
        return stream
    }

    function sync(other) {
        for (var i = 0; i < state.length; i++) {
            var item = state[i]
                , index = other.indexOf(item)

            if (index === -1) {
                other.push(item)
            }
        }
    }
}

function createStream(list) {
    var stream = SpliceStream(list.id)

    bind(list, stream)

    return stream
}

function bind(list, stream) {
    list.on("splice", onsplice)

    stream.other.on("data", ondata)
    
    function ondata(data) {
        var args = data[0]
            , source = data[2]

        list.spliceWithSource(args, source)
    }

    function onsplice(args, source) {
        var ts = Date.now()
            , data = [args, ts, source]

        stream.other.write(data)
    }
}