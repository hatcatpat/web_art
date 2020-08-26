export class Trig {
  constructor(obj) {
    this.res = obj.res
    this.pos_dur = obj.pos_dur * 60
    this.intensity_dur = obj.intensity_dur * this.pos_dur
    this.max_intensity = obj.max_intensity
    this.looping = obj.looping
    this.dir = obj.dir

    this.done = false
    this.t = 0
    this.pos = { x: 0, y: 0 }
    this.intensity = 0
  }

  getIntensity(g, p, r) {
    return 1 - Math.abs(g - p) / r
  }

  getScale(i, j) {
    var val = 0
    if (this.dir.dir == 0) {
      val =
        this.getIntensity(j, this.pos.y, this.res.y) * (i == this.dir.v ? 1 : 0)
    } else if (this.dir.dir == 1) {
      val =
        this.getIntensity(i, this.pos.x, this.res.x) * (j == this.dir.v ? 1 : 0)
    }

    return val * this.intensity * this.max_intensity
  }

  update() {
    if (!this.done) {
      var perc = this.t / this.pos_dur

      this.pos.x = perc * this.res.x
      this.pos.y = perc * this.res.y

      if (this.t < this.intensity_dur) {
        this.intensity = this.t / this.intensity_dur
      } else if (this.t > this.pos_dur - this.intensity_dur) {
        this.intensity =
          1 -
          (this.t - (this.pos_dur - this.intensity_dur)) / this.intensity_dur
      } else {
        this.intensity = 1
      }

      this.t++
      if (this.t > this.pos_dur) {
        this.t = 0
        if (!this.looping) {
          this.done = true
        }
      }
    }
  }
}
