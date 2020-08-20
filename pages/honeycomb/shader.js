import * as SHADERS from "../../utils/General/shaders.js"

export function frag() {
  return (
    `\n
  uniform float time;
  uniform vec2 res;
  uniform sampler2D image;
  ` +
    SHADERS.noise() +
    SHADERS.nearest() +
    SHADERS.map() +
    SHADERS.hsb() +
    SHADERS.simplexGrid() +
    `\n

  vec3 nearest3(vec3 v, float d){
    return vec3(
      nearest(v.x,d),
      nearest(v.y,d),
      nearest(v.z,d)
    );
  }
  vec2 nearest2(vec2 v, float d){
    return vec2(
      nearest(v.x,d),
      nearest(v.y,d)
    );
  }
  void main() {
    vec2 st = gl_FragCoord.st/res;
    
    //st.x /= 2.0;
    st.x += 0.4;

    vec3 col = texture2D(image,st).xyz;
    col = rgb2hsb(col);

    col.z *=  map( noise( st+time/8.0 ), 1.0,2.0, 0.0,1.0);
    if(col.z > 1.0){ col.z = 1.0; }

    st = nearest2(st, col.z * noise(st*2.0+time/3.0) * 0.2 );

    col = texture2D(image,st + random(st+time)*0.01 ).xyz;

    col = rgb2hsb(col);
    col.z *=  map( noise( st+time/8.0 ), 1.0,2.0, 0.0,1.0);
    if(col.z > 1.0){ col.z = 1.0; }
    col = hsb2rgb(col);

    gl_FragColor = vec4(col,1);
  }
  `
  )
}
