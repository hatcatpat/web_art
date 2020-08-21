import * as SHADERS from "../../utils/General/shaders.js"

export function frag() {
  return (
    `\n
  varying vec2 vUv;
  uniform float time;
  uniform vec2 res;
  uniform sampler2D image;
  uniform sampler2D tex;
  ` +
    SHADERS.noise() +
    SHADERS.nearest() +
    SHADERS.map() +
    SHADERS.hsb() +
    SHADERS.simplexGrid() +
    SHADERS.circle() + 
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

  vec2 p(float th){
    return ( 
	vec2( cos(th), sin(th) ) * 0.3
    ) + 0.5;
  }

  void main() {
    vec2 st = gl_FragCoord.st/res;
    st *= vUv;
    vec3 col = vec3(1.0);
    
    float pi = 3.1415;
    float th = time;

    vec2 p1 = p(th);
    vec2 p2 = p(th+pi/3.0);
    vec2 p3 = p(th+2.0*pi/3.0);
    vec2 p4 = p(th+4.0*pi/3.0);
    vec2 p5 = p(th+5.0*pi/3.0);
    vec2 p6 = p(th+6.0*pi/3.0);

    float r = map( st.x, 2.0,8.0, 0.0,1.0);
    float d = ( 
	min(
	  length(st-p1),
	  min(
	    length(st-p2),
	    min(
	      length(st-p3),
	      min(
		length(st-p4),
		min(
		  length(st-p5),
		  length(st-p6)
		)
	      )
	    )
	  )
      )
    );
    d = map( d, 0.1,1.0, 0.0,1.0);
    float n = noise(
	nearest2(st*r,d) + vec2(time,time/4.0)
    );

    col = vec3( length(st*d*r) );

    st *= n;
    st += random(st+time)*0.01;
    
    if(st.x < 0.1){
      col = texture2D(image, st+vec2(time/4.0,0.0) ).xyz;
    } else {
      col = texture2D(tex, st*2.0 ).xyz * 1.5;
    }
  

    gl_FragColor = vec4(col,1.0);
  }
  `
  )
}
