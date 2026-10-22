// Printer sounds, synthesised with Web Audio so there is nothing to download.
// On by default; turning it off is remembered on this device.

const KEY = "receipt-sound";
const listeners = new Set();
let ctx = null;
let enabled = true;

try {
  enabled = typeof window === "undefined" || localStorage.getItem(KEY) !== "off";
} catch {
  enabled = true;
}

const audio = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

// One second of white noise, reused for every sound.
let noiseBuffer = null;
const noise = (ac) => {
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  return src;
};

export const isSoundOn = () => enabled;

export const subscribeSound = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Must be called from a click so the browser allows audio to start.
export const setSound = (on) => {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((fn) => fn(on));
  // Play a short sample straight away so turning it on is audible.
  if (on) {
    audio();
    playFeed([[0, 0.12], [0.2, 0.32]]);
  }
};

// Browsers keep audio locked until the visitor interacts with the page, so a
// remembered "on" can't play during the first print. Unlock on the first
// interaction so the next print and tear are heard.
if (typeof window !== "undefined") {
  const unlock = () => {
    if (enabled) audio();
    ["pointerdown", "keydown", "touchstart"].forEach((type) =>
      window.removeEventListener(type, unlock, true)
    );
  };
  ["pointerdown", "keydown", "touchstart"].forEach((type) =>
    window.addEventListener(type, unlock, true)
  );
}

// A thermal printer's stepper motor: a buzzy whirr for each burst of feed.
// `bursts` are [start, end] pairs in seconds. Returns a function that stops it.
export const playFeed = (bursts) => {
  if (!enabled) return () => {};
  const ac = audio();
  if (ac.state !== "running") return () => {};
  const now = ac.currentTime + 0.02;
  const out = ac.createGain();
  out.gain.value = 0.3;
  out.connect(ac.destination);

  const hiss = noise(ac);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 1.4;
  const motor = ac.createOscillator();
  motor.type = "square";
  motor.frequency.value = 180;
  const motorGain = ac.createGain();
  motorGain.gain.value = 0.35;

  const env = ac.createGain();
  env.gain.value = 0;
  hiss.connect(band).connect(env);
  motor.connect(motorGain).connect(env);
  env.connect(out);

  for (const [start, end] of bursts) {
    env.gain.setTargetAtTime(1, now + start, 0.008);
    env.gain.setTargetAtTime(0, now + end, 0.01);
  }
  const last = bursts.length ? bursts[bursts.length - 1][1] : 0;
  hiss.start(now);
  motor.start(now);
  hiss.stop(now + last + 0.2);
  motor.stop(now + last + 0.2);

  return () => {
    const t = ac.currentTime;
    env.gain.cancelScheduledValues(t);
    env.gain.setTargetAtTime(0, t, 0.01);
    try {
      hiss.stop(t + 0.05);
      motor.stop(t + 0.05);
    } catch {}
  };
};

// Paper tearing against the serrated bar: a short crackle of noise.
export const playTear = () => {
  if (!enabled) return;
  const ac = audio();
  const now = ac.currentTime + 0.01;
  const src = noise(ac);
  const high = ac.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 1800;
  const env = ac.createGain();
  env.gain.value = 0;
  // Uneven grains, like fibres giving way one after another.
  let t = now;
  while (t < now + 0.22) {
    env.gain.setValueAtTime(0.1 + Math.random() * 0.5, t);
    t += 0.008 + Math.random() * 0.012;
  }
  env.gain.setTargetAtTime(0, t, 0.02);
  src.connect(high).connect(env).connect(ac.destination);
  src.start(now);
  src.stop(t + 0.15);
};
