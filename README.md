# splice-stream

Stream changes to an array

## Data protocol

`[[/* Array.prototype.splice arguments */], timestamp, sourceIdentifier]`

A splice-stream emits an array, where the first value is an array of parameters compatible with `Array.prototype.slice`. This represents the delta in change on an array.

The second value is a time stamp which can be used for clever synchronization. 

The third value is a source identifier. It's used to identify who created this splice

## Example

TODO

## Installation

`npm install splice-stream`

## Contributors

 - Raynos

## MIT Licenced