// Export to avoid circular reference issues
module.exports = SpliceStream

var Source = require("source-stream")
    , List = require("./interfaces/list")
    , MovableList = require("./interfaces/movableList")

SpliceStream.fromList = List.createStream
SpliceStream.List = List
SpliceStream.MovableList = MovableList

function SpliceStream(id) {
    var stream = Source()
        , list

    stream.createList = returnList
    stream.sync = sync

    return stream

    function returnList() {
        if (!list) {
            list = List(stream)
        }
        
        return list
    }

    function sync(other) {
        var selfList = returnList()
            , otherList = other.createList()

        selfList.sync(otherList)
    }
}