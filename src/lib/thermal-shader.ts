export const vertexShader = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

// An artistic impression of deposition paths and their cooling history,
// rather than a simulation or a visualization of measured production data.
export const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 pointer;
uniform float influence;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x),
             mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);
}
float fbm(vec2 p) {
  return noise(p)*0.57 + noise(p*2.03)*0.28 + noise(p*4.07)*0.15;
}
void main() {
  vec2 p = (gl_FragCoord.xy - resolution*0.5) / resolution.y;
  vec2 offset = p - pointer;
  float touch = exp(-dot(offset, offset)*12.0) * influence;
  float t = time*0.20;
  // A soft, local lens bends the layers underneath the moving cursor.
  p += offset * touch * 0.32;
  p.y += touch * 0.075;
  // Slowly changing folds retain coherent, fine parallel deposition traces.
  float warp = fbm(p*1.9 + vec2(t*0.16, -t*0.12));
  float lane = p.y + p.x*0.33
    + 0.22*sin(p.x*3.1 + t*0.32)
    + 0.17*sin(p.x*1.9 - t*0.21)
    + (warp-0.5)*0.26;
  float envelope = exp(-pow((lane-0.14)*2.15, 2.0));
  float fold = 0.5+0.5*sin(lane*17.0 + warp*4.2 + t*0.15);
  float ridges = pow(0.5+0.5*sin(lane*290.0 + warp*3.0), 14.0);
  float fine = pow(0.5+0.5*sin(lane*670.0), 22.0);
  // Heat moves through the field. Its wake settles into cool violet/blue.
  float heatCenter = 0.24 + 0.29*sin(t*0.48);
  float heat = exp(-pow((p.x-heatCenter)*2.25,2.0))
    * exp(-pow((lane-0.13-0.06*sin(t))*5.0,2.0));
  heat = min(1.0, heat + touch*0.55);
  float spread = fbm(vec2(p.x*2.8-t*0.13, lane*4.0+t*0.08));
  vec3 cold = mix(vec3(0.065,0.11,0.17), vec3(0.30,0.29,0.42), spread);
  vec3 hot = mix(vec3(0.48,0.20,0.105), vec3(0.72,0.47,0.27), spread);
  vec3 material = mix(cold, hot, heat*0.9);
  float depth = 0.17 + fold*fold*0.38;
  vec3 color = vec3(0.027,0.036,0.048);
  color += material*envelope*(depth + ridges*0.42 + fine*0.065);
  color += vec3(0.53,0.36,0.22)*heat*envelope*0.1;
  color += vec3(0.14,0.085,0.045)*touch*0.22;
  float vignette = 1.0-smoothstep(0.3,1.25,length(p*vec2(0.65,0.85)));
  color *= 0.55+0.45*vignette;
  color += (hash(gl_FragCoord.xy)-0.5)*0.014;
  gl_FragColor = vec4(color,1.0);
}
`;
