const assert = require('nanoassert')
module.exports = class NodeWrapper {
  constructor (context, type) {
    assert.ok(['analyser', 'filter', 'channelMerger', 'channelSplitter', 'convolver', 'delay', 'compressor', 'gain', 'iirfilter', 'panner', 'stereoPanner', 'waveShaper', 'buffer', 'constant', 'oscillator', 'mediaElement', 'mediaStream'].indexOf(type) > -1)  
    
    this.context = context
    this.outputs = new Set()
    this.inputs = new Set()
    this.type = type
  
    if (type === 'analyser') {
      this.instance = this.context.createAnalyser()
    } else if (type === 'filter') {
      this.instance = this.context.createBiquadFilter()
    } else if (type === 'channelMerger') {
      this.instance = this.context.createChannelMerger()
    } else if (type === 'channelSplitter') {
      this.instance = this.context.createChannelSplitter()
    } else if (type === 'convolver') {
      this.instance = this.context.createConvolver()
    } else if (type === 'delay') {
      this.instance = this.context.createDelay()
    } else if (type === 'compressor') {
      this.instance = this.context.createDynamicsCompressor()
    } else if (type === 'gain') {
      this.instance = this.context.createGain()
    } else if (type === 'iirfilter') {
      this.instance = this.context.createIIRFilter()
    } else if (type === 'panner') {
      this.instance = this.context.createPanner()
    } else if (type === 'stereoPanner') {
      this.instance = this.context.createStereoPanner()
    } else if (type === 'waveShaper') {
      this.instance = this.context.createWaveShaper()
    }
  }
  
  addNode (type) {
    var newNode = new NodeWrapper(this.context, type)
    if (this.instance) this.instance.connect(newNode.instance)
    this.outputs.add(newNode)
    newNode.inputs.add(this)
    return newNode
  }
  
  connectToDestination () {
    if (this.instance) this.instance.connect(this.context.destination)
    this.outputs.add(this.context.destination)
  }
  update (config) {
    if (this.type === 'analyser') {
      if (config.fftSize) this.instance.fftSize = config.fftSize
      if (config.minDecibels) this.instance.minDecibels = config.minDecibels
      if (config.maxDecibels) this.instance.maxDecibels = config.maxDecibels
      if (config.smoothingTimeConstant) this.instance.smoothingTimeConstant = config.smoothingTimeConstant
    } else if (this.type === 'filter') {
      if (config.frequency) this.instance.frequency.value = config.frequency
      if (config.detune) this.instance.detune.value = config.detune
      if (config.Q) this.instance.Q.value = config.Q
      if (config.gain) this.instance.gain.value = config.gain
      if (config.type) this.instance.type = config.type
    } else if (this.type === 'convolver') {
      if (config.buffer) this.instance.buffer = config.buffer
      if (config.normalize) this.instance.normalize = config.normalize
    } else if (this.type === 'delay') {
      if (config.delayTime) this.instance.delayTime.value = config.delayTime
    } else if (this.type === 'compressor') {
      if (config.threshold) this.instance.threshold.value = config.threshold
      if (config.knee) this.instance.knee.value = config.knee
      if (config.ratio) this.instance.ratio.value = config.ratio
      if (config.reduction) this.instance.reduction.value = config.reduction
      if (config.attack) this.instance.attack.value = config.attack
      if (config.release) this.instance.release.value = config.release
    } else if (this.type === 'gain') {
      if (config.gain) this.instance.gain.value = config.gain
    } else if (this.type === 'panner') {
      if (config.coneInnerAngle) this.instance.coneInnerAngle = config.coneInnerAngle
      if (config.coneOuterAngle) this.instance.coneOuterAngle = config.coneOuterAngle
      if (config.coneOuterGain) this.instance.coneOuterGain = config.coneOuterGain
      if (config.distanceModel) this.instance.distanceModel = config.distanceModel
      if (config.maxDistance) this.instance.maxDistance = config.maxDistance
      if (config.orientationX) this.instance.orientationX.value = config.orientationX
      if (config.orientationY) this.instance.orientationY.value = config.orientationY
      if (config.orientationZ) this.instance.orientationZ.value = config.orientationZ
      if (config.panningModel) this.instance.panningModel = config.panningModel
      if (config.positionX) this.instance.positionX.value = config.positionX
      if (config.positionY) this.instance.positionY.value = config.positionY
      if (config.positionZ) this.instance.positionY.value = config.positionY
      if (config.refDistance) this.instance.refDistance = config.refDistance
      if (config.rolloffFactor) this.instance.rolloffFactor = config.rolloffFactor
    } else if (this.type === 'stereoPanner') {
      if (config.pan) this.instance.pan = config.pan
    } else if (this.type === 'waveShaper') {
      if (config.curve) this.instance.curve = config.curve
      if (config.oversample) this.instance.oversample = config.oversample
    }
  }
}
