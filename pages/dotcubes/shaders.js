import * as SHADERS from "../../utils/General/shaders.js"

function dots() {
  return (
    `
    uniform float u_time;
    uniform float u_dot_num;
    uniform float u_dot_res;
    uniform vec2 u_res;
    uniform sampler2D u_tex;
    ` +
    SHADERS.nearest() +
    SHADERS.noise() +
    SHADERS.line() +
    SHADERS.hsb() +
    SHADERS.map() +
    `\n
    void main(){
      vec2 st = gl_FragCoord.st / u_res;
      
      //st -= 0.5;
      //st *= 0.5;
      //st += 0.5;
      //st = fract(st*2.0);

      vec3 tex = texture2D(u_tex, st).xyz;
      vec3 tex_hsb = rgb2hsb(tex);

      //tex_hsb.x = noise(st+u_time);
      tex = hsb2rgb(tex_hsb);
      
      vec2 no = (vec2(u_time, tex_hsb.z));
      vec2 n = 2.0*fract(u_dot_num*st+no) - 1.0;

      tex *= 1.0-step( u_dot_res, length(n)*(2.0+8.0*(1.0-tex_hsb.z) ) );

      gl_FragColor = vec4(tex,1.0);
    }
  `
  )
}

export var frag = { dots: dots }
