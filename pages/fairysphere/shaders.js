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
    SHADERS.circle() +
    SHADERS.hsb() +
    SHADERS.map() +
    `\n
    void main(){
      vec2 st = gl_FragCoord.st / u_res;
      
      float aspect = u_res.x / u_res.y;

      vec3 tex = texture2D(u_tex, st).xyz;
      vec3 tex_hsb = rgb2hsb(tex);

      tex_hsb.y *= 2.0;
      tex = hsb2rgb(tex_hsb);
      
      vec2 n = 2.0*fract( vec2(u_dot_num*aspect, u_dot_num)*st) - 1.0;
      
      tex *= circle(st, n, u_dot_res);
      //tex *= 1.0-step( u_dot_res, length(n)*(2.0+8.0*(1.0-tex_hsb.z) ) );

      gl_FragColor = vec4(tex,1.0);
    }
  `
  )
}

export var frag = { dots: dots }
