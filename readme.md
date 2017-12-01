# web-audio-graph
[![Build Status](https://img.shields.io/travis/YerkoPalma/web-audio-graph/master.svg?style=flat-square)](https://travis-ci.org/YerkoPalma/web-audio-graph) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> web audiograph builder

## Usage

```js
var AudioGraph = require('web-audio-graph')
var graph = new AudioGraph()

var source = graph.addSource('oscillator')
var filter = source.addNode('filter')
var gain = filter.addNode('gain')

source.play()
```
## License
[MIT](/license)
