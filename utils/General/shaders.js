//
//	UTILS
//

export function map() {
  return `\n
  float map(float x, float out_min, float out_max,
		     float in_min, float in_max){
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  `
}

export function line() {
  return `\n
  float lineEq(vec2 st, vec2 A, vec2 B){
    if(B.x == A.x){
      return abs(st.x - A.x);
    } else {
      float m = (B.y-A.y) / (B.x-A.x);
      float c = (A.y*B.x - A.x*B.y) / (B.x-A.x);
      return abs( st.y - m*st.x - c );
    }
  }
  float line_blur = 10.0;
  vec3 line(vec2 st, vec2 start, vec2 end, float width){
    float leq = lineEq(st,start,end);
    float len = length(end-start);
    if (leq < width && max( length(st-start), length(st-end) ) < len ){
      return vec3( floor( smoothstep(0.0,1.0, leq/width * line_blur )*2.0 ) );
    } else {
      return vec3(1.0);
    }
  }
  `
}

export function nearest() {
  return `\n
    float nearest(float x, float d){
      return floor(x/d)*d;
    }
  `
}

export function random() {
  return `\n
    float random (vec2 st) {
      return fract(sin(dot(st.xy,
	vec2(12.9898,78.233)))*
	43758.5453123);
    }
  `
}

export function noise() {
  return (
    random() +
    `\n
    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	// Four corners in 2D of a tile
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));

	// Smooth Interpolation

	// Cubic Hermine Curve.  Same as SmoothStep()
	vec2 u = f*f*(3.0-2.0*f);
	// u = smoothstep(0.,1.,f);

	// Mix 4 coorners percentages
	return mix(a, b, u.x) +
		(c - a)* u.y * (1.0 - u.x) +
		(d - b) * u.x * u.y;
    }
  `
  )
}

//
//	FRAG
//
function noiseFogShader() {
  return (
    `\n
    varying vec2 vUv;
    uniform vec3 col;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float t;
    ` +
    random() +
    noise() +
    `\n
    void main() {
      gl_FragColor = vec4(col,1.0) * (noise(gl_FragCoord.st*8.0)/3.0) * 4.0;
      #ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
	  float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
	  float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	  float fogFactor = smoothstep( fogNear, fogFar, depth );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
    }
  `
  )
}

function fogShader() {
  return `\n
    varying vec2 vUv;
    uniform vec3 col;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float t;
    void main() {
      gl_FragColor = vec4(col,1.0);
      #ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
	  float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
	  float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	  float fogFactor = smoothstep( fogNear, fogFar, depth );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
    }
  `
}

export var frag = { fogShader: fogShader, noiseFogShader: noiseFogShader }
//
//	VERT
//
function basicVert() {
  return `\n
      varying vec2 vUv;
      varying vec3 vPosition;
      void main( void ) {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
  `
}

export var vert = { basic: basicVert }
