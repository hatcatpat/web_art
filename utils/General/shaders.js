function random(){
  return `
    float random (vec2 st) {
      return fract(sin(dot(st.xy,
	vec2(12.9898,78.233)))*
	43758.5453123);
    }
  `
}

function noise(){
  return `
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
}

function noiseFogShader() {
  return `
    varying vec2 vUv;
    uniform vec3 col;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float t;
    ` 
    + random()
    + noise()
    + `
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
}

// red red red
export var frag = { noiseFogShader: noiseFogShader }
export var vert = {  }
