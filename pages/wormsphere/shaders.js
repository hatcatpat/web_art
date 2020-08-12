function noiseFogShader() {
  return `
    varying vec2 vUv;
    uniform vec3 col;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    float random (vec2 st) {
      return fract(sin(dot(st.xy,
	vec2(12.9898,78.233)))*
	43758.5453123);
    }

    void main() {
      gl_FragColor = vec4(col,1.0) * (random(gl_FragCoord.st)/2.0) * 2.0;
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
