// Audio Feedback System using Web Audio API - Virtual Lab IPL
// Respects state.volume without requiring external audio assets

import { state } from '../main.js';

// Shared AudioContext instance (lazily initialized on first user gesture)
let _audioCtx = null;

function getAudioContext() {
  if (!_audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      _audioCtx = new AudioContextClass();
    }
  }
  if (_audioCtx && _audioCtx.state === 'suspended') {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}

/**
 * Base tone player helper
 * @param {number} freq - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
 * @param {number|null} endFreq - Optional target frequency for frequency ramp (slide)
 */
export function playBeep(freq, duration, type = 'sine', endFreq = null) {
  if (!state || state.volume === 0) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    const now = ctx.currentTime;
    const masterVol = (state.volume / 100) * 0.15;

    // Frequency setup
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), now + duration);
    }

    // Gain envelope (anti-click fade in and fade out)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(masterVol, now + 0.01);
    gain.gain.setValueAtTime(masterVol, now + duration - 0.03);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch (err) {
    console.warn("Audio playback not supported or blocked by browser policy:", err);
  }
}

/**
 * Nada naik ceria (660Hz lalu 880Hz) — untuk validasi LULUS
 */
export function playSuccess() {
  if (!state || state.volume === 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterVol = (state.volume / 100) * 0.18;

    // First note: 660 Hz (0.13s)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(660, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(masterVol, now + 0.01);
    gain1.gain.linearRampToValueAtTime(0.0001, now + 0.13);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Second note: 880 Hz (0.24s)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.13);
    gain2.gain.setValueAtTime(0.001, now + 0.13);
    gain2.gain.linearRampToValueAtTime(masterVol * 1.1, now + 0.14);
    gain2.gain.setValueAtTime(masterVol * 1.1, now + 0.28);
    gain2.gain.linearRampToValueAtTime(0.0001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.13);
    osc2.stop(now + 0.40);
  } catch (e) {}
}

/**
 * Nada rendah/buzz tegas (220Hz durasi 0.3s) — untuk validasi GAGAL & simulasi diblokir
 */
export function playError() {
  if (!state || state.volume === 0) return;
  playBeep(220, 0.30, 'sawtooth');
}

/**
 * Nada sedang pendek (440Hz durasi 0.15s) — untuk peringatan tidak fatal
 */
export function playWarning() {
  if (!state || state.volume === 0) return;
  playBeep(440, 0.15, 'sine');
}

/**
 * Efek dramatis khusus korsleting: kombinasi 3 lapisan (noise burst + sub-bass thump + sawtooth tail)
 * Dipanggil saat MCB trip karena short circuit
 */
export function playShortCircuit() {
  if (!state || state.volume === 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const masterVol = (state.volume / 100);

    // LAPISAN 1: White noise burst (suara "krak" ledakan)
    const bufferSize = ctx.sampleRate * 0.35;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // noise dengan decay alami
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(4000, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(masterVol * 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.36);

    // LAPISAN 2: Sub-bass thump (dentuman rendah)
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(35, now + 0.25);
    thumpGain.gain.setValueAtTime(masterVol * 0.6, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.42);

    // LAPISAN 3: Ekor sawtooth listrik (sisa dari versi sebelumnya, dipertahankan)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.45);
    gain.gain.setValueAtTime(0.001, now + 0.05);
    gain.gain.linearRampToValueAtTime(masterVol * 0.22, now + 0.08);
    gain.gain.setValueAtTime(masterVol * 0.22, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.05);
    osc.stop(now + 0.52);
  } catch (e) {}
}

/**
 * Klik pendek saat saklar / MCB di-toggle saat simulasi berjalan (600Hz durasi 0.04s)
 */
export function playSwitchClick() {
  if (!state || state.volume === 0) return;
  playBeep(600, 0.04, 'triangle');
}

/**
 * Bunyi pendek halus saat kabel berhasil tersambung ke pin/junction (520Hz durasi 0.06s)
 */
export function playConnect() {
  if (!state || state.volume === 0) return;
  playBeep(520, 0.06, 'sine');
}

let _lastUIClickTime = 0;

/**
 * Klik pendek untuk navigasi/tombol UI umum (BUKAN aksi merakit).
 * Karakter suara sengaja dibuat berbeda dari playSwitchClick/playConnect.
 */
export function playUIClick() {
  if (!state || state.volume === 0) return;
  const now = Date.now();
  if (now - _lastUIClickTime < 60) return;
  _lastUIClickTime = now;
  playBeep(350, 0.035, 'square');
}

// Elemen audio khusus untuk sirene peringatan fatal, dibuat malas (lazy) saat pertama diputar
let _siren = null;
function getSiren() {
  if (!_siren) {
    _siren = new Audio();
    _siren.preload = 'none';
    _siren.src = 'src/assets/audio/alert-siren.mp3';
    _siren.addEventListener('error', () => {
      console.warn('File suara alert-siren.mp3 belum tersedia atau gagal dimuat — sirene alert dinonaktifkan sementara.');
    });
  }
  return _siren;
}

/**
 * Memutar file audio sirene untuk menandai munculnya kartu peringatan kesalahan FATAL.
 * Memakai file audio asli (bukan sintesis), mengikuti pola yang sama seperti BGM.
 */
export function playCriticalAlertSiren() {
  if (!state || state.volume === 0) return;
  try {
    const siren = getSiren();
    siren.currentTime = 0; // ulangi dari awal jika sedang/sudah pernah diputar
    siren.volume = state.volume / 100;
    siren.play().catch(() => {});
  } catch (e) {}
}

