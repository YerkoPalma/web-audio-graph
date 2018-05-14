const assert = require('nanoassert')
const NodeWrapper = require('./NodeWrapper')

module.exports = class SourceWrapper extends NodeWrapper {
  constructor (context, type, value) {
    super(context, type)

    this.outputs = new Set()
    this._value = value
    this.isPlaying = false
    this._pausedAt = 0
  }
  
  play (time) {
    if (!this.isPlaying) {
      if (this.type === 'buffer') {
        this.instance = this.context.createBufferSource()
        this.instance.buffer = this._value
      } else if (this.type === 'constant') {
        this.instance = this.context.createConstantSource()
      } else if (this.type === 'oscillator') {
        this.instance = this.context.createOscillator()
      } else if (this.type === 'mediaElement') {
        this.instance = this.context.createMediaElementSource(this._value)
      } else if (this.type === 'mediaStream') {
        this.instance = this.context.createMediaStreamSource(this._value)
      }
  
      // restore connections
      this.outputs.forEach(output => {
        this.instance.connect(output.instance)
      })
  
      this.instance.start(this._pausedAt || time)
      this.isPlaying = true
    }
  }
  
  stop () {
    if (this.isPlaying) {
      this.instance.stop()
      this.isPlaying = false
      this._pausedAt = 0
    }
  }
  
  pause () {
    if (this.isPlaying) {
      this.instance.stop()
      this.isPlaying = false
      this._pausedAt = this.context.currentTime
    }
  }
  
  update (config) {
    if (this.type === 'buffer') {
      if (config.buffer) this.instance.buffer = config.buffer
      if (config.loop) this.instance.loop = config.loop
      if (config.detune) this.instance.detune.value = config.detune
      if (config.playbackRate) this.instance.playbackRate.value = config.playbackRate
    } else if (this.type === 'constant') {
      if (config.offset) this.instance.offset.value = config.offset
    } else if (this.type === 'oscillator') {
      if (config.type) this.instance.type = config.type
      if (config.detune) this.instance.detune.value = config.detune
      if (config.frequency) this.instance.frequency.value = config.frequency
    }
  }
}
