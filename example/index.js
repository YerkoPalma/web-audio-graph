var AudioGraph = require('..')
var graph = new AudioGraph()

var source = graph.addSource('oscillator')
var filter = source.addNode('filter')
var gain = filter.addNode('gain')
gain.connectToDestination()

source.play()
