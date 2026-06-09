// Aurora / nebula background shader for a fullscreen triangle.
// Rendered with THREE.ShaderMaterial (position + uv are injected built-ins),
// so the vertex shader ignores the camera and writes clip space directly.

export const auroraVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

export const auroraFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uMouse;       // normalized [0,1], y up
  uniform vec2  uResolution;  // pixels
  varying vec2  vUv;

  // ── Ashima simplex noise ────────────────────────────────────────────────
  vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    vec2  shift = vec2(100.0);
    mat2  rot = mat2(0.87758, 0.47943, -0.47943, 0.87758); // cos/sin(0.5)
    for (int i = 0; i < 5; i++){
      v += a * snoise(p);
      p  = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  float hash21(vec2 p){
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  vec3 auroraRamp(float t){
    vec3 cyan   = vec3(0.431, 0.906, 0.976); // #6EE7F9
    vec3 violet = vec3(0.655, 0.545, 0.980); // #A78BFA
    vec3 pink   = vec3(0.957, 0.443, 0.714); // #F472B6
    vec3 col = mix(cyan, violet, smoothstep(0.0, 0.5, t));
    col      = mix(col,  pink,   smoothstep(0.5, 1.0, t));
    return col;
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    vec2  mouse     = (uMouse - 0.5) * vec2(aspect, 1.0);
    float mouseDist = length(p - mouse);
    float mouseWarp = 0.18 * exp(-mouseDist * 2.2);

    float t = uTime * 0.10;

    // domain-warped fbm for the flowing veins
    vec2 q;
    q.x = fbm(p + t * 0.30 + mouse * mouseWarp);
    q.y = fbm(p + vec2(5.2, 1.3) + t * 0.25);

    vec2 r;
    r.x = fbm(p + 1.7 * q + vec2(1.7, 9.2) + t * 0.18 + mouse * mouseWarp * 0.5);
    r.y = fbm(p + 1.7 * q + vec2(8.3, 2.8) + t * 0.20);

    float f = fbm(p + 2.2 * r);

    // higher threshold → sparser, more elegant veins instead of fog
    float band = smoothstep(0.48, 0.95, f + 0.42 * q.x);

    // bias the ramp toward cyan/violet, with pink reserved for the brightest cores
    float ramp = clamp(0.44 + f * 0.40 + r.x * 0.16, 0.0, 1.0);
    vec3 auroraCol = auroraRamp(ramp);

    vec3  base = vec3(0.021, 0.024, 0.039); // ~#06070B
    float glow = pow(band, 2.7) * 0.60;

    float mouseLift = 0.15 * exp(-mouseDist * 3.8);
    glow = clamp(glow + mouseLift * band, 0.0, 1.0);

    vec3 col = mix(base, auroraCol, glow);
    col += auroraCol * pow(band, 6.0) * 0.26;

    // soft vignette for depth
    float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
    col *= mix(0.80, 1.0, vig);

    // animated film grain
    float grain = hash21(uv * uResolution + mod(uTime, 100.0)) * 2.0 - 1.0;
    col += grain * 0.014;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`
