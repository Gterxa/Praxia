/**
 * Fondos "Silk" y "Waves": dos exports del 21st.dev Shader Builder que trajo
 * Tony. Van en su propio módulo porque empacan los uniformes distinto a
 * fondos-hero.ts — u_colors[8] más siete vec4 (u_scene/u_shape/u_surface/
 * u_finish/u_transform/u_space/u_cursor) en vez de u_res/u_t más los siete
 * colores sueltos de COMUN — y unificar los dos esquemas en un solo tipo
 * habría sido más frágil que tener un segundo mando pequeño.
 *
 * El fragment shader de cada receta se deja TAL CUAL lo entregó la
 * herramienta (Tony pidió explícitamente "usa exactamente este shader"): lo
 * único que cambia respecto al export original son los cuatro colores fijos
 * del header, reemplazados en tiempo de ejecución por la rampa de marca
 * (mismos seis tonos que --degradado-atardecer en tokens.css: noche →
 * violeta → magenta → coral → brasa → sol), para no romper la regla de
 * color de fondos-hero.ts. El resto de la receta (velocidad, zoom,
 * intensidad, warp, contraste, brillo, saturación, hue, viñeta, grano,
 * cursor) es el valor empacado que trae cada comentario de cabecera, sin
 * tocar.
 */
import { hexAVec3, type ColoresHero } from './fondos-hero';

export interface RecetaGenerador {
  fragmento: string;
  /** Hasta 8 colores RGB 0..1; solo se usan los primeros `colorCount`. */
  colores: Array<[number, number, number]>;
  colorCount: number;
  /** u_scene.z = segundos transcurridos * este factor. */
  tiempoFactor: number;
  /** u_shape: escala, intensidad, paramA, warp. */
  forma: [number, number, number, number];
  /** u_surface: detalle, contraste, brillo, saturación. */
  superficie: [number, number, number, number];
  /** u_finish: hue (radianes), viñeta, blur, grano. */
  acabado: [number, number, number, number];
  /** u_transform: seed, rotación (radianes), drift, interruptor OKLab. */
  transformar: [number, number, number, number];
  /** u_space.xy: offset del campo. */
  offset: [number, number];
  cursor: {
    /** Si es false, la presencia del cursor queda en 0 y el shader lo ignora. */
    activo: boolean;
    /** 0 empuje, 1 repele, 2 remolino, 3 onda, 4 resplandor/spotlight. */
    efecto: number;
    fuerza: number;
    radio: number;
  };
}

/** La rampa oficial de marca (--degradado-atardecer), como vec3 0..1. */
function rampaMarca(paleta: ColoresHero): Array<[number, number, number]> {
  return [
    hexAVec3(paleta.noche, paleta.noche),
    hexAVec3(paleta.violeta, paleta.violeta),
    hexAVec3(paleta.magenta, paleta.magenta),
    hexAVec3(paleta.coral, paleta.coral),
    hexAVec3(paleta.brasa, paleta.brasa),
    hexAVec3(paleta.sol, paleta.sol),
  ];
}

// "Silk" — made with the 21st.dev Shader Builder
const SILK_FRAGMENTO = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// "Waves" — made with the 21st.dev Shader Builder
const WAVES_FRAGMENTO = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float y = uv.y
    + sin(uv.x * (3.0 + u_intensity * 9.0) + t * 0.8) * 0.08
    + (fbm(p * 2.0 + t * 0.1) - 0.5) * u_intensity * 0.6;
  return palette(y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const VERTICE = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;

export function crearRecetaSilk(paleta: ColoresHero): RecetaGenerador {
  const colores = rampaMarca(paleta);
  return {
    fragmento: SILK_FRAGMENTO,
    colores,
    colorCount: colores.length,
    tiempoFactor: 0.57,
    forma: [1.26, 0.35, 0.5, 0.0],
    superficie: [1.82, 0.85, 0.0, 1.0],
    acabado: [0.0, 0.0, 0.0, 0.04],
    transformar: [1.0, 0.0, 0.0, 0.0],
    offset: [0.0, 0.0],
    // "Cursor: off" en la receta original.
    cursor: { activo: false, efecto: 2.0, fuerza: 0.65, radio: 0.46 },
  };
}

export function crearRecetaWaves(paleta: ColoresHero): RecetaGenerador {
  const colores = rampaMarca(paleta);
  return {
    fragmento: WAVES_FRAGMENTO,
    colores,
    colorCount: colores.length,
    tiempoFactor: 1.37,
    forma: [1.62, 0.16, 0.73, 0.14],
    superficie: [1.06, 1.5, 0.01, 1.5],
    // El hue de la receta original (4.64 rad / 266°) estaba calibrado sobre
    // la paleta teal/cian del export: girar ESA paleta 266° es lo que hace
    // "Waves" cian. Aplicado sobre la rampa de marca, el mismo giro cae en
    // verde/rojo — justo lo que la regla de color prohíbe. En 0 se ve la
    // rampa tal cual, igual que en Silk.
    acabado: [0.0, 0.39, 0.01, 0.04],
    transformar: [6736.0, 3.61, 0.07, 0.0],
    offset: [0.0, 0.17],
    // "Cursor: spotlight" — efecto 4 (resplandor) en el shader original.
    cursor: { activo: true, efecto: 4.0, fuerza: 0.56, radio: 0.64 },
  };
}

export interface MandoGenerador {
  cambiar: (receta: RecetaGenerador) => void;
  destruir: () => void;
}

export function montarGenerador(
  canvas: HTMLCanvasElement,
  recetaInicial: RecetaGenerador,
  reducido: boolean,
): MandoGenerador | null {
  const rendirse = (motivo: string, detalle?: string | null) => {
    canvas.style.display = 'none';
    console.warn(`[fondo-generador] ${motivo}`, detalle ?? '');
    return null;
  };

  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return rendirse('sin contexto WebGL');

  const compilar = (tipo: number, fuente: string) => {
    const s = gl.createShader(tipo);
    if (!s) return null;
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[fondo-generador] no compila:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vs = compilar(gl.VERTEX_SHADER, VERTICE);
  if (!vs) return rendirse('no compila el vértice');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  let programa: WebGLProgram | null = null;
  let receta = recetaInicial;
  let uColores: WebGLUniformLocation | null = null;
  let uEscena: WebGLUniformLocation | null = null;
  let uForma: WebGLUniformLocation | null = null;
  let uSuperficie: WebGLUniformLocation | null = null;
  let uAcabado: WebGLUniformLocation | null = null;
  let uTransformar: WebGLUniformLocation | null = null;
  let uEspacio: WebGLUniformLocation | null = null;
  let uCursor: WebGLUniformLocation | null = null;

  function usar(nueva: RecetaGenerador): boolean {
    const fs = compilar(gl!.FRAGMENT_SHADER, nueva.fragmento);
    const p = gl!.createProgram();
    if (!fs || !p) return false;
    gl!.attachShader(p, vs!);
    gl!.attachShader(p, fs);
    gl!.linkProgram(p);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
      console.warn('[fondo-generador] no enlaza:', gl!.getProgramInfoLog(p));
      return false;
    }
    if (programa) gl!.deleteProgram(programa);
    programa = p;
    receta = nueva;
    gl!.useProgram(p);

    const a = gl!.getAttribLocation(p, 'a');
    gl!.enableVertexAttribArray(a);
    gl!.vertexAttribPointer(a, 2, gl!.FLOAT, false, 0, 0);

    uColores = gl!.getUniformLocation(p, 'u_colors');
    uEscena = gl!.getUniformLocation(p, 'u_scene');
    uForma = gl!.getUniformLocation(p, 'u_shape');
    uSuperficie = gl!.getUniformLocation(p, 'u_surface');
    uAcabado = gl!.getUniformLocation(p, 'u_finish');
    uTransformar = gl!.getUniformLocation(p, 'u_transform');
    uEspacio = gl!.getUniformLocation(p, 'u_space');
    uCursor = gl!.getUniformLocation(p, 'u_cursor');

    if (uColores) {
      const plano = new Float32Array(nueva.colores.length * 3);
      nueva.colores.forEach(([r, g, b], i) => {
        plano[i * 3] = r;
        plano[i * 3 + 1] = g;
        plano[i * 3 + 2] = b;
      });
      gl!.uniform3fv(uColores, plano);
    }
    if (uForma) gl!.uniform4f(uForma, ...nueva.forma);
    if (uSuperficie) gl!.uniform4f(uSuperficie, ...nueva.superficie);
    if (uAcabado) gl!.uniform4f(uAcabado, ...nueva.acabado);
    if (uTransformar) gl!.uniform4f(uTransformar, ...nueva.transformar);
    if (uEscena) gl!.uniform4f(uEscena, canvas.width, canvas.height, 0, nueva.colorCount);
    return true;
  }

  if (!usar(recetaInicial)) return rendirse('no se pudo preparar el fondo');

  let vivo = true;
  let visible = true;
  let raf = 0;
  const inicio = performance.now();

  /** Presencia del cursor: 0..1 suavizado, no el booleano crudo del puntero. */
  let presenciaObjetivo = 0;
  let presencia = 0;
  let mouseX = 0;
  let mouseY = 0;

  const alMover = (e: PointerEvent) => {
    if (!receta.cursor.activo) return;
    const caja = canvas.getBoundingClientRect();
    const dentro =
      e.clientX >= caja.left &&
      e.clientX <= caja.right &&
      e.clientY >= caja.top &&
      e.clientY <= caja.bottom;
    presenciaObjetivo = dentro ? 1 : 0;
    if (dentro && caja.width > 0 && caja.height > 0) {
      mouseX = ((e.clientX - caja.left) / caja.width) * 2 - 1;
      mouseY = 1 - ((e.clientY - caja.top) / caja.height) * 2;
    }
  };
  const alSalir = () => {
    presenciaObjetivo = 0;
  };
  window.addEventListener('pointermove', alMover);
  window.addEventListener('pointerleave', alSalir);

  // DPR real, tope en 2 (pedido explícito de Tony): estos dos fondos no
  // corren a media resolución como el resto del archivo.
  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
  }

  function pintar(ahora: number) {
    const t = ((reducido ? inicio : ahora) - inicio) / 1000;
    if (uEscena) gl!.uniform4f(uEscena, canvas.width, canvas.height, t * receta.tiempoFactor, receta.colorCount);
    if (uEspacio) gl!.uniform4f(uEspacio, receta.offset[0], receta.offset[1], mouseX, mouseY);
    if (uCursor) {
      gl!.uniform4f(
        uCursor,
        receta.cursor.activo ? presencia : 0,
        receta.cursor.efecto,
        receta.cursor.fuerza,
        receta.cursor.radio,
      );
    }
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function frame(ahora: number) {
    if (!vivo || !visible) return;
    presencia += (presenciaObjetivo - presencia) * 0.08;
    pintar(ahora);
    raf = requestAnimationFrame(frame);
  }

  function arrancar() {
    if (!vivo || reducido) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault();
      vivo = false;
      cancelAnimationFrame(raf);
      canvas.style.display = 'none';
    },
    { once: true },
  );

  const resize = new ResizeObserver(() => {
    ajustar();
    pintar(performance.now());
  });
  resize.observe(canvas);

  const io = new IntersectionObserver(
    ([entrada]) => {
      visible = entrada?.isIntersecting ?? true;
      if (visible) arrancar();
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  // Pausa explícita al ocultar la pestaña, además del IntersectionObserver.
  const alCambiarVisibilidad = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (visible) {
      arrancar();
    }
  };
  document.addEventListener('visibilitychange', alCambiarVisibilidad);

  ajustar();
  pintar(performance.now());
  arrancar();

  return {
    cambiar(nueva: RecetaGenerador) {
      if (!vivo) return;
      if (usar(nueva)) {
        ajustar();
        pintar(performance.now());
      }
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerleave', alSalir);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      if (programa) gl.deleteProgram(programa);
      gl.deleteBuffer(buffer);
    },
  };
}
