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

## API
### var graph = AudioGraph([context])
This module expose the main `AudioGraph` class, use it to create a new instance 
of an audio graph. There's no need for the `new` keyword. The only argument to 
pass is optional, use it if you want to give the graph object a known 
[AudioContext][AudioContext], if you omit this parameter a new AudioContext will 
be created. An AudioGraph has two main properties:

- **`context`**: Reference to the AudioContext object for this graph.
- **`sources`**: A [Set][Set] object that store each SourceWrapper fro this graph.

### var source = graph.addSource(type, value)
Creates a new source node of the `type` specified, where type is a string of 
`buffer`, `constant`, `oscillator`, `mediaElement` and `mediaStream`. For some 
of those types, you need to pass a value to create the source.

- **`buffer`**: Creates a [AudioBufferSourceNode][AudioBufferSourceNode], this 
type of source need an [AudioBuffer][AudioBuffer] as value. A common pattern for 
this source is to load through ajax (fetch) a file.

```js
fetch('music.mp3')
.then(response => response.arrayBuffer())
.then(buffer => {
  graph.context.decodeAudioData(buffer, audioBuffer => {
    var source = graph.addSource('buffer', audioBuffer)
    // ...
  })
})
```

- **`constant`**: Creates a [ConstantSourceNode][ConstantSourceNode], `value` 
param is not used.
- **`oscillator`**: Creates a [OscillatorNode][OscillatorNode], `value` 
param is not used.
- **`mediaElement`**: Creates a [MediaElementAudioSourceNode][MediaElementAudioSourceNode] 
from an existing [<audio>][audio] element. For this source, you need to pass the 
audio element as the value.
- **`mediaStream`**: Creates a [MediaStreamAudioSourceNode][MediaStreamAudioSourceNode]. 
Use this if you want to get user input from [getUserMedia][getUserMedia] as the source.

```js
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia ({audio: true, video: true})
  .then(function (stream) {
    var source = graph.addSource('mediaStream', stream)
    // ...
  })
}
```

If given params are correct, a source node instance is returned. Source nodes 
have the following properties.

- **`context`**: Reference to the AudioContext object for this source (always 
the same as the grpah from which this source was created).
- **`outputs`**: A [Set][Set] object that store each output node for this source.
- **`type`**: The type passed to the constructor.
- **`isPlaying`**: A boolean set to `true` if the source is playing and `false` 
otherwise.

### graph.play()
Start playing all the sources for this graph.

### graph.stop()
Stop all the sources for this graph.

### graph.pause()
Pause all the sources for this graph.

### var newNode = node.addNode(type)
Add a node of the given type. This method can be called for a normal node or a 
source node (source node inherits from normal nodes). You can't add source nodes 
with this method, because source node has no inputs (_they are the input_), and 
source node can only be added to the graph itself. The availaible types are 
`analyser` (to add [AnalyserNode][AnalyserNode]), `filter` (to add 
[BiquadFilterNode][BiquadFilterNode]), `channelMerger` (to add 
[ChannelMergerNode][ChannelMergerNode]), `channelSplitter` (to add 
[ChannelSplitterNode][ChannelSplitterNode]), `convolver` (to add 
[ConvolverNode][ConvolverNode]), `delay` (to add [DelayNode][DelayNode]), 
`compressor` (to add [DynamicsCompressorNode][DynamicsCompressorNode]), `gain` 
(to add [GainNode][GainNode]), `iirfilter` (to add [IIRFilterNode][IIRFilterNode]), 
`panner` (to add [PannerNode][PannerNode]), `stereoPanner` (to add 
[StereoPannerNode][StereoPannerNode]) and `waveShaper` (to add [WaveShaperNode][WaveShaperNode]).

### var newWorletNode = node.addWorkletNode(script, processor)
Add a AudioWorkletNode. Similar to the normal addNode method, but returns a 
Promise that resolves to the newly added AudioWorkletNode. You need to pass
the processor script file name as the first argument and the processor name 
as the second argument.

```js
node.addWorkletNode('gain-processor.js', 'gain-processor')
  .then(gainWorklet => {
    gainWorklet.connectToDestination()
    // or keep adding (worklet)nodes
    source.play()
  })
```

### node.connectToDestination()
Connect a node to the `context.destination` fo the graph.

### node.update(config)
Update properties of the node. The properties of the config object depend on the 
type of node. Currently supported properties are:

- For `analyser` nodes: `fftSize`, `minDecibels`, `maxDecibels` and 
`smoothingTimeConstant`.
- For `filter` nodes: `frequency`, `detune`, `Q`, `gain` and `type`.
- For `convolver` nodes: `buffer` and `normalize`.
- For `delay` nodes: `delayTime`.
- For `compressor` nodes: `threshold`, `knee`, `ratio`, `reduction`, `attack` 
and `release`.
- For `gain` nodes: `gain`.
- For `panner` nodes: `coneInnerAngle`, `coneOuterAngle`, `coneOuterGain`, 
`distanceModel`, `maxDistance`, `orientationX`, `orientationY`, `orientationZ`, 
`panningModel`, `positionX`, `positionY`, `positionZ`, `refDistance`,and `rolloffFactor`.
- For `stereoPanner` nodes: `pan`.
- For `waveShaper` nodes: `curve` and `oversample`.

Each of these properties are set directly to their respectives nodes, so check 
those for further documentation.

### source.play([time])
Play the source at the given `time`. If time is not set, it defaults to 0.

### source.stop()
Stop the source.

### source.pause()
Stop the source and save the currentTime so the next time you call `play` it 
will pass the time when you last paused.

### source.update()
Update properties of the source. The properties of the config object depend on the 
type of source. Currently supported properties are:

- For `buffer` nodes: `buffer`, `loop`, `detune` and `playbackRate`.
- For `constant` nodes: `offset`.
- For `oscillator` nodes: `type`, `detune` and `frequency`.

Each of these properties are set directly to their respectives sources, so check 
those for further documentation.

## License
[MIT](/license)

[AudioContext]: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
[AudioBufferSourceNode]: https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
[AudioBuffer]: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
[ConstantSourceNode]: https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode
[OscillatorNode]: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
[MediaElementAudioSourceNode]: https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode
[audio]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
[MediaStreamAudioSourceNode]: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode
[getUserMedia]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
[AnalyserNode]: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
[BiquadFilterNode]: https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
[ChannelMergerNode]: https://developer.mozilla.org/en-US/docs/Web/API/ChannelMergerNode
[ChannelSplitterNode]: https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode
[ConvolverNode]: https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode
[DelayNode]: https://developer.mozilla.org/en-US/docs/Web/API/DelayNode
[DynamicsCompressorNode]: https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
[GainNode]: https://developer.mozilla.org/en-US/docs/Web/API/GainNode
[IIRFilterNode]: https://developer.mozilla.org/en-US/docs/Web/API/IIRFilterNode
[PannerNode]: https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
[StereoPannerNode]: https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
[WaveShaperNode]: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode