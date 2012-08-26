var Source = require("source-stream")
    , List = require("./interfaces/list")

SpliceStream.fromList = List.createStream

module.exports = SpliceStream

function SpliceStream(id) {
    var stream = Source()
        , list = List(stream)

    stream.createList = returnList

    return stream

    function returnList() {
        return list
    }
}