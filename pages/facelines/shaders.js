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
    `\n
    void main(){
      vec2 st = gl_FragCoord.st / u_res;
      //vec2 st = position.xy / u_res;
      vec3 tex = texture2D(u_tex, st).xyz;
      //float bright = tex.x + tex.y + tex.z;
      //bright /= 3.0;
      vec3 tex_hsb = rgb2hsb(tex);
      
      vec2 n = 2.0*fract(u_dot_num*st) - 1.0;
      
      //tex *= 1.0-step( u_dot_res, length(n) );

      vec2 start = n;
      //float angle = random(st) * 2.0 * 3.1415;
      //float angle = noise(st+u_time) * 2.0 * 3.1415;

      //float angle = bright * 1.0 * 3.1415;
      float angle = tex_hsb.x * 2.0 * 3.1415;
      float radius = (tex_hsb.y+tex_hsb.z)/2.0 * 8.0;
      vec2 end = vec2(
	radius * cos(angle),
	radius * sin(angle)
      );
      tex -= line(st, start, start+end, 4.0 );

      gl_FragColor = vec4(tex,1.0);
    }
  `
  )
}

export var frag = { dots: dots }
