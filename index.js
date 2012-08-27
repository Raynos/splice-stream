var Source = require("source-stream")
    , List = require("./interfaces/list")

SpliceStream.fromList = List.createStream

module.exports = SpliceStream

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