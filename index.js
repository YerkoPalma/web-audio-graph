const assert = require('assert')

module.exports = class AudioGraph {
  constructor (context) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = context || new window.AudioContext()
    this._sources = new Set()
  }

  get sources () {
    return this._sources
  }

  addSource (source, value) {
    var newSource = new SourceWrapper(this.context, source, value)
    this._sources.add(newSource)
    return newSource
  }

  play () {
    this._sources.forEach(source => {
      source.play()
    })
  }

  stop () {
    this._sources.forEach(source => {
      source.stop()
    })
  }
}

class NodeWrapper {
  contructor (context, type) {
    assert.ok(['analyser', 'filter', 'channelMerger', 'channelSplitter', 'convolver', 'delay', 'compressor', 'gain', 'iirfilter', 'panner', 'stereoPanner', 'waveShaper'].indexOf(type) > -1)
    this.context = context
    this._outputs = new Set()
    this._inputs = new Set()
    this.type = type

    if (type === 'analyser') {
      this._instance = this.context.createAnalyser()
    } else if (type === 'filter') {
      this._instance = this.context.createBiquadFilter()
    } else if (type === 'channelMerger') {
      this._instance = this.context.createChannelMerger()
    } else if (type === 'channelSplitter') {
      this._instance = this.context.createChannelSplitter()
    } else if (type === 'convolver') {
      this._instance = this.context.createConvolver()
    } else if (type === 'delay') {
      this._instance = this.context.createDelay()
    } else if (type === 'compressor') {
      this._instance = this.context.createDynamicsCompressor()
    } else if (type === 'gain') {
      this._instance = this.context.createGain()
    } else if (type === 'iirfilter') {
      this._instance = this.context.createIIRFilter()
    } else if (type === 'panner') {
      this._instance = this.context.createPanner()
    } else if (type === 'stereoPanner') {
      this._instance = this.context.createStereoPanner()
    } else if (type === 'waveShaper') {
      this._instance = this.context.createWaveShaper()
    }
  }

  get instance () {
    return this._instance
  }
  get inputs () {
    return this._inputs
  }
  get outputs () {
    return this._outputs
  }

  addNode (nodeType) {
    var newNode = new NodeWrapper(this.context, nodeType)
    this._instance.connect(newNode.instance)
    this._outputs.add(newNode)
    newNode.inputs.add(this)
    return newNode
  }

  update (config) {
    if (this.type === 'analyser') {
      if (config.fftSize) this._instance.fftSize = config.fftSize
      if (config.minDecibels) this._instance.minDecibels = config.minDecibels
      if (config.maxDecibels) this._instance.maxDecibels = config.maxDecibels
      if (config.smoothingTimeConstant) this._instance.smoothingTimeConstant = config.smoothingTimeConstant
    } else if (this.type === 'filter') {
      if (config.frequency) this._instance.frequency.value = config.frequency
      if (config.detune) this._instance.detune.value = config.detune
      if (config.Q) this._instance.Q.value = config.Q
      if (config.gain) this._instance.gain.value = config.gain
      if (config.type) this._instance.type = config.type
    } else if (this.type === 'convolver') {
      if (config.buffer) this._instance.buffer = config.buffer
      if (config.normalize) this._instance.normalize = config.normalize
    } else if (this.type === 'delay') {
      if (config.delayTime) this._instance.delayTime.value = config.delayTime
    } else if (this.type === 'compressor') {
      if (config.threshold) this._instance.threshold.value = config.threshold
      if (config.knee) this._instance.knee.value = config.knee
      if (config.ratio) this._instance.ratio.value = config.ratio
      if (config.reduction) this._instance.reduction.value = config.reduction
      if (config.attack) this._instance.attack.value = config.attack
      if (config.release) this._instance.release.value = config.release
    } else if (this.type === 'gain') {
      if (config.gain) this._instance.gain.value = config.gain
    } else if (this.type === 'panner') {
      if (config.coneInnerAngle) this._instance.coneInnerAngle = config.coneInnerAngle
      if (config.coneOuterAngle) this._instance.coneOuterAngle = config.coneOuterAngle
      if (config.coneOuterGain) this._instance.coneOuterGain = config.coneOuterGain
      if (config.distanceModel) this._instance.distanceModel = config.distanceModel
      if (config.maxDistance) this._instance.maxDistance = config.maxDistance
      if (config.orientationX) this._instance.orientationX.value = config.orientationX
      if (config.orientationY) this._instance.orientationY.value = config.orientationY
      if (config.orientationZ) this._instance.orientationZ.value = config.orientationZ
      if (config.panningModel) this._instance.panningModel = config.panningModel
      if (config.positionX) this._instance.positionX.value = config.positionX
      if (config.positionY) this._instance.positionY.value = config.positionY
      if (config.positionZ) this._instance.positionY.value = config.positionY
      if (config.refDistance) this._instance.refDistance = config.refDistance
      if (config.rolloffFactor) this._instance.rolloffFactor = config.rolloffFactor
    } else if (this.type === 'stereoPanner') {
      if (config.pan) this._instance.pan = config.pan
    } else if (this.type === 'waveShaper') {
      if (config.curve) this._instance.curve = config.curve
      if (config.oversample) this._instance.oversample = config.oversample
    }
  }
}

class SourceWrapper extends NodeWrapper {
  constructor (context, type, value) {
    assert.ok(['buffer', 'constant', 'oscillator', 'mediaElement', 'mediaStream'].indexOf(type) > -1)

    super(context, type)

    this.type = type
    if (type === 'buffer') {
      this._instance = this.context.createBufferSource()
      this._instance.buffer = value
    } else if (type === 'constant') {
      this._instance = this.context.createConstantSource()
    } else if (type === 'oscillator') {
      this._instance = this.context.createOscillator()
    } else if (type === 'mediaElement') {
      this._instance = this.context.createMediaElementSource(value)
    } else if (type === 'mediaStream') {
      this._instance = this.context.createMediaStreamSource(value)
    }
  }
  play (time) {
    this._instance.start(time || 0)
  }
  stop () {
    this._instance.stop()
  }
  update (config) {
    if (this.type === 'buffer') {
      if (config.buffer) this._instance.buffer = config.buffer
      if (config.loop) this._instance.loop = config.loop
      if (config.detune) this._instance.detune.value = config.detune
      if (config.playbackRate) this._instance.playbackRate.value = config.playbackRate
    } else if (this.type === 'constant') {
      if (config.offset) this._instance.offset.value = config.offset
    } else if (this.type === 'oscillator') {
      if (config.type) this._instance.type = config.type
      if (config.detune) this._instance.detune.value = config.detune
      if (config.frequency) this._instance.frequency.value = config.frequency
    }
  }
}
