const SourceWrapper = require('./SourceWrapper')

module.exports = class AudioGraph {
  constructor (context) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = context || new window.AudioContext()
    this.sources = new Set()
  }

  addSource (source, value) {
    var newSource = new SourceWrapper(this.context, source, value)
    this.sources.add(newSource)
    return newSource
  }

  play () {
    this.sources.forEach(source => {
      source.play()
    })
  }

  stop () {
    this.sources.forEach(source => {
      source.stop()
    })
  }

  pause () {
    this.sources.forEach(source => {
      source.pause()
    })
  }
}
