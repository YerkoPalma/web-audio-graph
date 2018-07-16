/* global fetch requestAnimationFrame */

/* button stuff */
var button = document.createElement('button')
button.textContent = 'click me!'
button.onclick = play

var workletButton = document.createElement('button')
workletButton.textContent = 'click me! (worklet)'
workletButton.onclick = playWorklet

document.body.appendChild(button)
document.body.appendChild(workletButton)

function playWorklet () {
  var AudioGraph = require('..')
  var graph = new AudioGraph()
  var source = graph.addSource('oscillator')
  source.addWorkletNode('noise-generator.js', 'noise-generator').then(worklet => {
    worklet.connectToDestination()
    source.play()
  })
}

function play () {
  fetch('music.mp3')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    var AudioGraph = require('..')
    var graph = new AudioGraph()
    graph.context.decodeAudioData(buffer, audioBuffer => {
      var source = graph.addSource('buffer', audioBuffer)
      source.connectToDestination()

      source.play()
    })
  })
}
