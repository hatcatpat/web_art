import * as SHADERS from "../../utils/General/shaders.js"

function dots() {
  return (
    `
    uniform float u_time;
    uniform float u_dot_num;
    uniform float u_dot_res;
    uniform vec2 u_res;
    varying vec2 vUv;
    ` +
    SHADERS.nearest() +
    SHADERS.noise() +
    SHADERS.line() +
    SHADERS.hsb() +
    SHADERS.map() +
    `\n
    void main(){
      vec2 st = gl_FragCoord.st / u_res;
      st *= vUv;
      vec3 col = vec3(1.0);

      vec2 n = 2.0*fract(u_dot_num*st) - 1.0;
      col *= 1.0-step( u_dot_res, length(n) );
      
      gl_FragColor = vec4(col,1.0);
    }
  `
  )
}

export var frag = { dots: dots }

export var vert = { simple: SHADERS.vert.basic }
