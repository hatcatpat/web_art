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

addPage("seaside", "three 20 8 20")
//addPage("paper", "three 19 8 20")
//addPage("updown", "p5 18 8 20")
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
