import * as SHADERS from "../../utils/General/shaders.js"

export function bumpMap() {
  return (
    `\n
    uniform float u_time;
    uniform vec2 u_res;
    ` +
    SHADERS.noise() +
    `\n
    void main(){
      vec2 st = gl_FragCoord.st / u_res;
      vec3 col = vec3( noise(st/100.0+vec2(u_time*0.5,u_time*2.0)/4.0) );
      gl_FragColor = vec4(col, 1.0);
    }
    `
  )
}
