"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Portrait.module.css";

// Engraved sine-wave portrait, after the speaker cards on cursor.com/compile.
// The photo is sampled into rows of horizontal sine waves whose amplitude
// follows image darkness; a WebGL2 fragment shader draws them as an SDF.
// On hover a soft horizontal band under the cursor thickens strokes and
// fades light ones, which reads as the image "sharpening".

const MAX_ROWS = 256;
const MAX_AMPLITUDE = 0.8;
const CONTRAST = 0.95;
const STROKE_RATIO = 0.15;
// Reference band radius is 600px on a 1024px-tall canvas.
const HOVER_RADIUS = 600 / 1024;
const REST = { x: -9999, y: -9999, radius: 0, strength: 0 };

const VERT = `#version 300 es
void main() {
  float x = gl_VertexID == 1 ? 3.0 : -1.0;
  float y = gl_VertexID == 2 ? 3.0 : -1.0;
  gl_Position = vec4(x, y, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;

#define MAX_ROWS ${MAX_ROWS}
const float TAU = 6.283185307179586;
const float HOVER_AMP_BOOST = 1.1;
const float HOVER_AMP_GAMMA = 1.1;
const float HOVER_ALPHA_FADE = 0.75;
const float HOVER_STROKE_BOOST = 1.5;

uniform sampler2D u_data;
uniform vec2 u_renderSize;
uniform float u_rowCount;
uniform float u_rowStep;
uniform float u_startY;
uniform float u_colStep;
uniform float u_strokeWidth;
uniform float u_maxAmp;
uniform int u_dataWidth;
uniform vec3 u_color;
uniform float u_ampScales[MAX_ROWS];
uniform vec2 u_mousePos;
uniform float u_mouseRadius;
uniform float u_mouseStrength;

out vec4 outColor;

void main() {
  vec2 pos = gl_FragCoord.xy;
  pos.y = u_renderSize.y - pos.y;

  float hoverMask = 1.0;
  float mouseFactor = 1.0;
  if (u_mouseRadius > 0.0) {
    hoverMask = smoothstep(0.0, u_mouseRadius, abs(pos.y - u_mousePos.y));
    float boost = mix(1.0, HOVER_AMP_BOOST, 1.0 - hoverMask);
    mouseFactor = mix(1.0, boost, u_mouseStrength);
  }
  float localHover = (1.0 - hoverMask) * u_mouseStrength;
  float gamma = mix(1.0, HOVER_AMP_GAMMA, localHover);
  float halfSw = u_strokeWidth * 0.5 * mix(1.0, HOVER_STROKE_BOOST, localHover);
  float aa = 1.0;
  float bestDist = halfSw + aa + 1.0;
  float bestSignal = 0.0;

  int rowCenter = int(floor((pos.y - u_startY) / u_rowStep + 0.5));

  for (int dr = -1; dr <= 1; dr++) {
    int ri = rowCenter + dr;
    if (ri < 0 || ri >= int(u_rowCount)) continue;

    float rowY = u_startY + float(ri) * u_rowStep;
    float as = u_ampScales[ri] * mouseFactor;
    if (abs(pos.y - rowY) > u_maxAmp * as + halfSw + aa + 1.0) continue;

    // Odd rows are offset half a cell so wave groups don't line up vertically.
    float rowOff = (ri & 1) == 1 ? u_colStep * 0.5 : 0.0;
    float adjX = pos.x + rowOff;
    int ci = clamp(int(floor(adjX / u_colStep)), 0, u_dataWidth - 1);
    float cf = clamp(adjX / u_colStep - float(ci), 0.0, 1.0);

    vec4 d0 = texelFetch(u_data, ivec2(ci, ri), 0);
    int gWaves = int(d0.b * 255.0 + 0.5);
    if (gWaves == 0) continue;
    int gStart = int(d0.g * 255.0 + 0.5);
    int gCells = int(d0.a * 255.0 + 0.5);

    int nextCi = min(ci + 1, u_dataWidth - 1);
    float signal = mix(d0.r, texelFetch(u_data, ivec2(nextCi, ri), 0).r, cf);
    float amp = pow(signal, gamma) * u_maxAmp * as;

    float gStartX = float(gStart) * u_colStep - rowOff;
    float gSpan = float(gCells) * u_colStep;
    float phase = ((pos.x - gStartX) / gSpan) * float(gWaves) * TAU;
    float waveY = rowY + sin(phase) * amp;
    float dydx = cos(phase) * amp * float(gWaves) * TAU / gSpan;
    float dist = abs(pos.y - waveY) * inversesqrt(1.0 + dydx * dydx);

    if (dist < bestDist) {
      bestDist = dist;
      bestSignal = signal;
    }
  }

  float alpha = 1.0 - smoothstep(halfSw - aa, halfSw + aa, bestDist);
  alpha *= mix(1.0, smoothstep(0.25, 0.75, bestSignal), localHover * HOVER_ALPHA_FADE);
  outColor = vec4(u_color * alpha, alpha);
}`;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

const loadPixels = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      // Downscale large photos; sampling never needs more than this.
      const scale = Math.min(1, 512 / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ data: ctx.getImageData(0, 0, w, h).data, w, h });
    };
    img.onerror = reject;
    img.src = src;
  });

// Column cells for a row; odd rows start half a cell to the left.
const rowCells = (width, step, row) => {
  const cells = [];
  for (let x = row % 2 === 1 ? -step / 2 : 0; x < width; x += step) {
    if (Math.min(width, x + step) > Math.max(0, x)) cells.push(x);
  }
  return cells;
};

const runOf = (classes, start, len, min) => {
  if (start + len > classes.length) return false;
  for (let i = 0; i < len; i++) if (classes[start + i] < min) return false;
  return true;
};

// Darker runs of cells are merged into groups with more waves per cell,
// giving the denser zig-zag texture in shadows.
const groupCells = (classes) => {
  const out = new Array(classes.length);
  let i = 0;
  while (i < classes.length) {
    const c = classes[i];
    // Near-black cells get no stroke at all (a hole in the engraving).
    if (c === 2) {
      out[i] = { start: i, waves: 0, cells: 1 };
      i += 1;
      continue;
    }
    let cells = 0;
    let waves = 0;
    if (c >= 1.75 && runOf(classes, i, 4, 1.75)) [cells, waves] = [4, 7];
    else if (c >= 1.5 && runOf(classes, i, 2, 1.5)) [cells, waves] = [2, 3];
    else if (c >= 1.25 && runOf(classes, i, 4, 1.25)) [cells, waves] = [4, 5];
    else [cells, waves] = [1, 1];
    for (let k = 0; k < cells; k++) out[i + k] = { start: i, waves, cells };
    i += cells;
  }
  return out;
};

const buildLayout = ({ data, w, h }, rowCount, height, aspect, levels) => {
  const rw = Math.max(1, Math.round(height * aspect));
  const rowStep = height / (rowCount - 1 + 1.5);
  const startY = 0.75 * rowStep;
  const cols = Math.max(1, Math.round(rw / Math.max(2, 0.75 * rowStep)));
  const colStep = rw / cols;
  const maxAmp = MAX_AMPLITUDE * rowStep;

  // object-fit: cover, centred
  const imgAspect = w / h;
  const scaleX = imgAspect > aspect ? aspect / imgAspect : 1;
  const scaleY = imgAspect > aspect ? 1 : imgAspect / aspect;
  const offX = (1 - scaleX) / 2;
  const offY = (1 - scaleY) / 2;
  const luma = (x, y) => {
    const px = Math.floor(clamp01(offX + (x / rw) * scaleX) * (w - 1));
    const py = Math.floor(clamp01(offY + (y / height) * scaleY) * (h - 1));
    const i = (py * w + px) * 4;
    return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
  };
  const centre = (x) => Math.max(0, Math.min(rw, x + colStep / 2));

  const rowsCells = [];
  const samples = [];
  let dataWidth = 0;
  for (let r = 0; r < rowCount; r++) {
    const y = startY + r * rowStep;
    const values = rowCells(rw, colStep, r).map((x) => luma(centre(x), y));
    rowsCells.push(values);
    samples.push(...values);
    dataWidth = Math.max(dataWidth, values.length);
  }

  // Auto-levels on the 5th–95th percentile, with a minimum spread. Flat
  // artwork passes fixed levels instead, since it's mostly one colour.
  samples.sort((a, b) => a - b);
  let lo = levels ? levels[0] : samples[Math.floor((samples.length - 1) * 0.05)];
  let hi = levels ? levels[1] : samples[Math.floor((samples.length - 1) * 0.95)];
  if (hi <= lo) [lo, hi] = [samples[0], samples[samples.length - 1]];
  if (!levels && hi - lo < 0.25) {
    const mid = (lo + hi) / 2;
    lo = Math.max(0, mid - 0.125);
    hi = Math.min(1, lo + 0.25);
  }

  const texture = new Uint8Array(dataWidth * rowCount * 4);
  rowsCells.forEach((values, r) => {
    const amps = [];
    const classes = [];
    for (const v of values) {
      const c = clamp01((clamp01((v - lo) / (hi - lo || 1)) - 0.5) * CONTRAST + 0.5);
      const dark = 1 - c;
      amps.push(MAX_AMPLITUDE * dark * rowStep);
      classes.push(dark >= 0.98 ? 2 : dark >= 0.8 ? 1.75 : dark >= 0.68 ? 1.5 : dark >= 0.6 ? 1.25 : 1);
    }
    const smooth = amps.map((a, i) =>
      amps.length < 3 ? a : 0.075 * (amps[i - 1] ?? a) + 0.85 * a + 0.075 * (amps[i + 1] ?? a)
    );
    const groups = groupCells(classes);
    smooth.forEach((a, i) => {
      const t = (r * dataWidth + i) * 4;
      texture[t] = Math.round(255 * clamp01(a / maxAmp));
      texture[t + 1] = groups[i].start;
      texture[t + 2] = groups[i].waves;
      texture[t + 3] = groups[i].cells;
    });
  });

  return {
    rw,
    rh: height,
    rowCount,
    rowStep,
    startY,
    colStep,
    sw: Math.max(0.8, rowStep * STROKE_RATIO),
    maxAmp,
    dataWidth,
    texture,
  };
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
};

const createRenderer = (canvas, layout, color) => {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");

  const vao = gl.createVertexArray();
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, layout.dataWidth, layout.rowCount, 0, gl.RGBA, gl.UNSIGNED_BYTE, layout.texture);
  for (const [k, v] of [
    [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
    [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
  ])
    gl.texParameteri(gl.TEXTURE_2D, k, v);

  const loc = (name) => gl.getUniformLocation(program, name);
  const u = {
    ampScales: loc("u_ampScales"),
    mousePos: loc("u_mousePos"),
    mouseRadius: loc("u_mouseRadius"),
    mouseStrength: loc("u_mouseStrength"),
  };

  // Static uniforms are set once; only scales and mouse change per frame.
  canvas.width = layout.rw;
  canvas.height = layout.rh;
  gl.viewport(0, 0, layout.rw, layout.rh);
  gl.useProgram(program);
  gl.uniform1i(loc("u_data"), 0);
  gl.uniform2f(loc("u_renderSize"), layout.rw, layout.rh);
  gl.uniform1f(loc("u_rowCount"), layout.rowCount);
  gl.uniform1f(loc("u_rowStep"), layout.rowStep);
  gl.uniform1f(loc("u_startY"), layout.startY);
  gl.uniform1f(loc("u_colStep"), layout.colStep);
  gl.uniform1f(loc("u_strokeWidth"), layout.sw);
  gl.uniform1f(loc("u_maxAmp"), layout.maxAmp);
  gl.uniform1i(loc("u_dataWidth"), layout.dataWidth);
  gl.uniform3fv(loc("u_color"), color);
  gl.bindVertexArray(vao);

  return {
    draw(scales, mouse) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1fv(u.ampScales, scales);
      gl.uniform2f(u.mousePos, mouse.x, mouse.y);
      gl.uniform1f(u.mouseRadius, mouse.radius);
      gl.uniform1f(u.mouseStrength, mouse.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.deleteTexture(tex);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
};

const parseColor = (css) => {
  const m = css.match(/[\d.]+/g) || [0, 0, 0];
  return new Float32Array(m.slice(0, 3).map((v) => Number(v) / 255));
};

const Portrait = ({
  src = "/portrait.jpg",
  alt = "Portrait",
  name,
  caption,
  rows = 80,
  revealDuration = 1.4,
  // "logo" is a square app icon, used inside a project's card.
  variant = "portrait",
  // Line colour; defaults to the receipt ink.
  color,
  // Fixed [black, white] luminance points; omitted means auto-levels.
  levels,
}) => {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas || typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rowCount = Math.min(Math.max(2, Math.round(rows)), MAX_ROWS);
    const scales = new Float32Array(MAX_ROWS).fill(reduced ? 1 : 0, 0, rowCount);
    let renderer = null;
    let layout = null;
    let cancelled = false;
    let raf = 0;
    let last = 0;
    let revealStart = null;
    let revealing = false;
    let mouse = REST;
    let target = REST;

    const draw = () => renderer?.draw(scales, mouse);

    // Single rAF loop, alive only while revealing or easing the hover band.
    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;

      if (revealing) {
        if (revealStart === null) revealStart = now;
        const p = Math.min((now - revealStart) / 1000 / revealDuration, 1);
        for (let r = 0; r < rowCount; r++) {
          scales[r] = easeInOutCubic(clamp01((p - (r / (rowCount - 1)) * 0.5) / 0.5));
        }
        if (p >= 1) revealing = false;
      }

      let easing = false;
      if (mouse !== target) {
        // Reference lerps 10% per 60fps frame; scale by dt for high-refresh screens.
        const k = 1 - Math.pow(0.9, dt * 60);
        const next = {
          x: mouse.x + (target.x - mouse.x) * k,
          y: mouse.y + (target.y - mouse.y) * k,
          radius: mouse.radius + (target.radius - mouse.radius) * k,
          strength: mouse.strength + (target.strength - mouse.strength) * k,
        };
        const settled =
          Math.abs(next.y - target.y) < 0.5 &&
          Math.abs(next.radius - target.radius) < 0.5 &&
          Math.abs(next.strength - target.strength) < 0.01;
        if (settled) mouse = target.strength > 0 ? target : (target = REST);
        else {
          mouse = next;
          easing = true;
        }
      }

      draw();
      if (revealing || easing) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      if (!layout) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) * layout.rw) / rect.width;
      const y = ((e.clientY - rect.top) * layout.rh) / rect.height;
      const radius = HOVER_RADIUS * layout.rh;
      target = { x, y, radius, strength: 1 };
      if (mouse.strength === 0) mouse = { x, y, radius, strength: 0 };
      wake();
    };
    const onLeave = () => {
      target = { ...mouse, strength: 0 };
      wake();
    };

    const setup = async () => {
      try {
        const pixels = await loadPixels(src);
        if (cancelled) return;
        // Render at device resolution (capped) rather than a fixed 1024px.
        const rect = frame.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const height = Math.round(Math.min(1024, Math.max(480, rect.height * dpr)));
        layout = buildLayout(pixels, rowCount, height, rect.width / rect.height || 0.75, levels);
        renderer = createRenderer(canvas, layout, parseColor(getComputedStyle(frame).color));
        if (!renderer) return;
        draw();
        setReady(true);
        if (!reduced) {
          frame.addEventListener("pointermove", onMove);
          frame.addEventListener("pointerleave", onLeave);
          revealObserver.observe(frame);
        }
      } catch {
        // Leave the plain <img> fallback in place.
      }
    };

    const onLost = (e) => {
      e.preventDefault();
      setReady(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    // Build the GL context only once the portrait is near the viewport.
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        loadObserver.disconnect();
        setup();
      },
      { rootMargin: "200px 0px" }
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        revealObserver.disconnect();
        revealing = true;
        wake();
      },
      { threshold: 0.2 }
    );
    loadObserver.observe(frame);

    return () => {
      cancelled = true;
      loadObserver.disconnect();
      revealObserver.disconnect();
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      renderer?.destroy();
      setReady(false);
    };
  }, [src, rows, revealDuration, levels?.[0], levels?.[1]]);

  return (
    <figure className={`${styles.portrait} ${styles[variant] || ""}`}>
      <div
        ref={frameRef}
        className={styles.frame}
        style={color ? { color } : undefined}
        data-ready={ready || undefined}
      >
        <img className={styles.fallback} src={src} alt={alt} decoding="async" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>
      {(name || caption) && (
        <figcaption className={styles.caption}>
          {name && <span>{name}</span>}
          {caption && <span className={styles.note}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
};

export default Portrait;
