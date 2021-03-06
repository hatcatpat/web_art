var container = document.getElementById("square-container")

function addPage(p, inf) {
  var div = document.createElement("div")
  div.className = "square"
  var a = document.createElement("a")
  a.className = "content"
  a.href = "pages/" + p + "/index.html"
  var text = document.createTextNode(p)

  var datediv = document.createElement("div")
  datediv.className = "date"
  var datetext = document.createTextNode(inf)
  datediv.appendChild(datetext)

  a.appendChild(text)
  div.appendChild(a)
  div.appendChild(datediv)
  container.appendChild(div)
}

addPage("xmas", "p5js 19 12 20")
addPage("refract", "p5js 16 10 20")
addPage("maze", "p5js 15 10 20")
addPage("face-clack2", "three 5 9 20")
addPage("face-clack", "three 4 9 20")
addPage("clack2", "three 4 9 20")
addPage("clack", "three 2 9 20")
addPage("bump", "three 1 9 20")
addPage("ribbon", "three 28 8 20")
addPage("ds9", "three 24 8 20")
addPage("ssll", "three 22 8 20")
addPage("mov", "three 21 8 20")
addPage("seaside", "three 20 8 20")
//addPage("darkpillar", "three 17 8 20")
addPage("fairysphere", "three 15 8 20")
addPage("dotcubes", "three 13 8 20")
addPage("noiseplane", "three 12 8 20")
addPage("wormsphere", "three 11 8 20")
addPage("lightballs", "three 10 8 20")
addPage("badsphere", "babylon 7 8 20")

const letters = "a b c d e f g h i j l m n o p q r s t u v w x y z \n \n \n".split(
  " "
)
for (var i = 0; i < 10; i++) {
  var s = new Array(Math.floor(Math.random() * 10 + 1))
  for (var j = 0; j < s.length; j++) {
    s[j] = letters[Math.floor(Math.random() * letters.length)]
  }
  s = s.join("")
  addPage(String(s), "")
}

var blocks = document.getElementsByClassName("content")
var colors = new Array(blocks.length)
var w = 4

function grayColor(c) {
  return "rgb(" + c + "," + c + "," + c + ")"
}

for (var i = 1; i < blocks.length; i++) {
  var c = Math.random() * 2 * Math.PI
  colors[i] = [c, Math.random() * 0.005 + 0.001]
}

function colorBlocks() {
  var scroll = document.documentElement.scrollTop
  var size = document
    .getElementsByClassName("flip-card")[0]
    .getBoundingClientRect().height

  for (var i = 1; i < blocks.length; i++) {
    var y = blocks[i].getBoundingClientRect().y + scroll

    if (y > scroll - size && y < scroll + window.innerHeight) {
      var c = (0.5 + Math.sin(colors[i][0]) / 2) * 255
      blocks[i].parentElement.style.background = grayColor(c)
      blocks[i].parentElement.style.color = grayColor((c + 255 / 4) % 255)

      colors[i][0] += colors[i][1]
      colors[i][0] %= Math.PI * 2
    }
  }

  requestAnimationFrame(colorBlocks)
}
colorBlocks()

window.requestAnimationFrame(colorBlocks)
