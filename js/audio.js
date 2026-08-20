export class PitchDetector {
  async start(callback) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Tu navegador no permite acceso al micrófono.");
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    await this.context.resume();

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;

    this.source = this.context.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);

    this.buffer = new Float32Array(this.analyser.fftSize);

    const update = () => {
      if (!this.analyser) return;
      this.analyser.getFloatTimeDomainData(this.buffer);
      callback(autoCorrelate(this.buffer, this.context.sampleRate));
      this.animationFrame = requestAnimationFrame(update);
    };

    update();
  }

  stop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.source) this.source.disconnect();
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());
    if (this.context && this.context.state !== "closed") this.context.close();
    this.analyser = null;
  }
}

export function autoCorrelate(buffer, sampleRate) {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);

  if (rms < 0.012) return -1;

  const size = buffer.length;
  const correlation = new Float32Array(size);

  for (let lag = 0; lag < size; lag++) {
    let sum = 0;
    for (let i = 0; i < size - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlation[lag] = sum;
  }

  const minLag = Math.floor(sampleRate / 1000);
  const maxLag = Math.min(size - 1, Math.floor(sampleRate / 70));

  let bestLag = -1;
  let bestValue = -Infinity;

  for (let lag = minLag; lag <= maxLag; lag++) {
    if (correlation[lag] > bestValue) {
      bestValue = correlation[lag];
      bestLag = lag;
    }
  }

  return bestLag > 0 ? sampleRate / bestLag : -1;
}

const NOTE_NAMES = [
  "DO", "DO♯", "RE", "RE♯", "MI", "FA",
  "FA♯", "SOL", "SOL♯", "LA", "LA♯", "SI"
];

export function frequencyToNote(frequency) {
  if (!frequency || frequency <= 0) return null;

  const midiFloat = 69 + 12 * Math.log2(frequency / 440);
  const midi = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midi) * 100);

  return {
    name: NOTE_NAMES[(midi % 12 + 12) % 12] + (Math.floor(midi / 12) - 1),
    cents
  };
}

export function evaluatePitch(frequency, targetFrequency) {
  if (!frequency || frequency <= 0) {
    return { score: 0, cents: null, label: "Sin señal" };
  }

  const cents = 1200 * Math.log2(frequency / targetFrequency);
  const distance = Math.abs(cents);
  const score = Math.max(
    0,
    Math.round(100 - Math.min(100, distance * 1.15))
  );

  return {
    score,
    cents: Math.round(cents),
    label:
      distance <= 10 ? "Perfecta" :
      distance <= 25 ? "Excelente" :
      distance <= 50 ? "Muy cerca" :
      distance <= 100 ? "Cerca" : "Lejos"
  };
}
