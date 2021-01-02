var blocks
let res_x, res_y
function setup() {
  createCanvas(windowWidth, windowHeight)
  // noSmooth()
  frameRate(60)
  smooth()

  res_x = 2
  res_y = 2
  blocks = []

  let m = 0.5
  let w = width / res_x * m
  let h = height / res_y * m
  for (let i = 0; i < res_x; i++) {
    for (let j = 0; j < res_y; j++) {
      let x = i * w + ((1 - m) / 2 * width)
      let y = j * h + ((1 - m) / 2 * height)

      blocks = blocks.concat(new MoireBlock(x, y, w, h))
    }
  }

}

function draw() {
  background(255)

  // rect(this.x, this.y, this.w, this.h)
  stroke(0)
  strokeWeight(32)

  rect(
    blocks[0].x, blocks[0].y,
    blocks[res_x - 1].x + blocks[res_x - 1].w,
    blocks[0].y + blocks[0].h,
  )

  blocks.forEach(block => {
    push()
    block.draw()
    pop()
  });

}

//
//
//

class MoireBlock {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.num_segs = floor(random(0, 64 + 1))
    this.num_lines = floor(random(1, 3 + 1))
    // this.num_segs = 16
    // this.num_lines = 3
    // this.angles = [0.8, 0.8, 0,1]

    this.angles = []
    this.angles = this.angles.concat(random(0.01, 0.9))
    this.angles = this.angles.concat(this.angles[0])
    this.angles = this.angles.concat(0)

    this.t = 0
    this.count = floor(random(0, 60))
  }

  draw() {

    stroke(0)
    strokeWeight(1)
    rect(this.x, this.y, this.w, this.h)
    // strokeWeight(2)

    for (let i = 0; i < this.num_lines; i++) {

      if (this.angles[i] == 0 || this.angles[i] == 1) {

        if (this.angles[i] == 0) {
          let y_unit = this.h / this.num_segs
          for (let j = 1; j < this.num_segs; j++) {
            let y = this.y + (j + 0.0) * y_unit
            line(this.x, y, this.x + this.w, y)
          }
        } else {
          let x_unit = this.w / this.num_segs
          for (let j = 0; j < this.num_segs; j++) {
            let x = this.x + (j + 0.5) * x_unit
            line(x, this.y, x, this.y + this.h)
          }
        }

      } else {

        let th = this.angles[i] * PI / 2
        let tan_th = th == 0 ? 1 : tan(th)

        if (i == 1) {
          translate(this.x + this.w / 2, this.y + this.h / 2)
          scale(1, -1)
          translate(-(this.x + this.w / 2), -(this.y + this.h / 2))
        }

        for (let j = 0; j < this.num_segs * this.num_segs; j++) {
          let y = 2 * (j + 0.5) / this.num_segs
          let x = y / tan_th
          let a = 0
          let b = 0
          if (x > 1) { a = (x - 1) * tan_th }
          if (y > 1) { b = (y - 1) / tan_th }

          x = this.x + min(x, 1) * this.w
          y = this.y + min(y, 1) * this.h
          a = this.y + min(a, 1) * this.h
          b = this.x + min(b, 1) * this.w

          line(b, y, x, a)
        }

      }

    }

    if (this.count % 60 == 0) {
      this.num_segs = floor(random(0, 32 + 1))
      this.num_lines = floor(random(1, 3 + 1))
      this.angles = []
      this.angles = this.angles.concat(random(0.01, 0.9))
      this.angles = this.angles.concat(this.angles[0])
      this.angles = this.angles.concat(0)
    }

    // this.angles[0] = map(sin(this.t), -1, 1, 0.01, 0.8)
    // this.angles[1] = map(sin(this.t + 5.3246), -1, 1, 0.01, 0.8)
    // this.angles[1] = this.angles[0]

    this.t += 0.01
    this.count++
  }
}