/* global fetch requestAnimationFrame */

/* button stuff */
var button = document.createElement('button')
button.textContent = 'click me!'
button.onclick = play

var workletButton = document.createElement('button')
workletButton.textContent = 'click me! (worklet)'
workletButton.onclick = playWorklet

/* Canvas stuff */
var canvas = document.createElement('canvas')
canvas.width = 1224
canvas.height = 768
var canvasCtx = canvas.getContext('2d')
var analyser
var dataArray
var bufferLength

document.body.appendChild(button)
document.body.appendChild(workletButton)
document.body.appendChild(canvas)

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

function draw () {
  requestAnimationFrame(draw)

  analyser.instance.getByteFrequencyData(dataArray)

  canvasCtx.fillStyle = 'rgb(200, 200, 200)'
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

  canvasCtx.lineWidth = 2
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

  canvasCtx.beginPath()

  var sliceWidth = canvas.width * 1.0 / bufferLength
  var x = 0

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0
    var y = v * canvas.height / 2

    if (i === 0) {
      canvasCtx.moveTo(x, y)
    } else {
      canvasCtx.lineTo(x, y)
    }

    x += sliceWidth
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2)
  canvasCtx.stroke()
}
