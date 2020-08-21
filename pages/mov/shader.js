import * as SHADERS from "../../utils/General/shaders.js"

export function frag() {
  return (
    `\n
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform vec2 res;
  ` +
    SHADERS.nearest() +
    SHADERS.noise() +
    SHADERS.hsb() +
    `\n
    vec2 nearest2(vec2 v, vec2 d){
      return vec2(
	nearest(v.x,d.x),
	nearest(v.y,d.y)
      );
    }
    void main(){
      vec2 st = gl_FragCoord.st / res;
      vec3 col = vec3(1.0);
	
      st *= vUv;
      st *= 16.0;

      vec2 nst = st * 8.0;

      float n =	noise( vec2(0.0,nst.y) + vec2(time,0.0) );

      float nx = noise( vec2(nst.x,0.0) + vec2(0.0,time) );
      
      //if(n < noise(vec2(time)/2.0) && nx < 0.4 ){
	//n = nx;
      //}
      n = mix(n,nx, noise(vec2(mod(time,60.0))) );
      n *= 2.0;

      if( n < 0.25 ){
	st.x += time;
      } else if( n < 0.5 ){
	st.x -= time;
      } else if( n < 0.75 ){
	st.y += time;
      } else {
	st.y -= time;
      }

      //col *= mod( time, 1.0);
      //col *= nearest( n, 0.1 );
      
      col = vec3(n);
      col = vec3( nearest(col.x, 0.5*noise(st+vec2(mod(time,60.0))) ) );
      col += random(st+time)*noise(vec2(mod(time,60.0)))*0.4;

      gl_FragColor = vec4(col,1.0);
    }
  `
  )
}

export function vert() {
  return (
    `\n
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    ` +
    `\n
    void main(){
      vUv = uv;
      vPosition = position;

      vec4 o = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      gl_Position = o;
    }
  `
  )
}
