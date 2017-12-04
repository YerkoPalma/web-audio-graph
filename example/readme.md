# web-audio-graph example

## Install & run

```bash
$ git clone https://github.com/YerkoPalma/web-audio-graph.git
$ cd web-audio-graph
$ npm install
$ npm start
```

## Content

This example show how to run a simple graph

![example graph](https://user-images.githubusercontent.com/5105812/33565931-3fb2e086-d8fd-11e7-9f4b-b54dcfbf8e50.png)

The relevant code for this graph is this

```js
var source = graph.addSource('buffer', audioBuffer)
var compresor = source.addNode('compressor')
analyser = compresor.addNode('analyser')
analyser.update({
  fftSize: 2048
})
analyser.connectToDestination()
```

Other things shown here is how to use some native methods from some nodes, not 
exposed in the main API. This is done going through the `instance` property, 
which is a reference to the main node. Here is done with the analyser node.

Other thing to notice is that, nodes can be updated after the source started 
playing, and that change will be reflected in the output sound.