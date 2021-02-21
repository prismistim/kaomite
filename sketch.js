let pg
let capture
let tracker
let mic

const windowSize = {
  width: 640,
  height: 480
}

const faceCircle = {
  x: 0,
  y: 0
}

function setup() {
  pg = createGraphics(windowSize.width, windowSize.height)

  capture = createCapture({
    audio: false,
    video: windowSize
  }, function() {
    console.log('capture ready.')
  })

  capture.elt.setAttribute('playsinline', '')
  createCanvas(windowSize.width, windowSize.height)
  capture.size(windowSize.width, windowSize.height)
  capture.hide()

  colorMode(RGB)

  tracker = new clm.tracker()
  tracker.init()
  tracker.start(capture.elt)

  mic = new p5.AudioIn()
  mic.start()
}

function draw() {
  const positions = tracker.getCurrentPosition()
  const micLevel = mic.getLevel()

  pg.background(255, 255, 255)

  pg.erase()
  pg.ellipse(pg.width / 2, pg.height / 2, windowSize.height * 0.8, windowSize.height * 0.8)
  pg.noErase()

  if (positions.length > 0) {
    const facePosition = {
      x: positions[62][0],
      y: positions[62][1]
    }

    if (facePosition.x < windowSize.width) {
      faceCircle.x = windowSize.width / 2 - facePosition.x
    } else if (facePosition.x > windowSize.width) {
      faceCircle.x = windowSize.width / 2 + facePosition.x
    }

    if (facePosition.y < windowSize.width) {
      faceCircle.y = windowSize.height / 2 - facePosition.y
    } else if (facePosition.y > windowSize.height) {
      faceCircle.y = windowSize.height / 2 + facePosition.y
    }
  }

  image(capture, faceCircle.x, faceCircle.y, windowSize.width, windowSize.height)

  if (micLevel > 0) {
    noFill()
    stroke(255, 204, 0)
    strokeWeight(10)
    ellipse(windowSize.width / 2, windowSize.height / 2, windowSize.height * 0.7, windowSize.height * 0.7)
  }

  image(pg, 0, 0)
}