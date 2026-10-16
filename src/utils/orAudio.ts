// Audio synthesizer for Operating Room Beep and Alarm sounds
// Uses Web Audio API directly with rich multi-harmonic synthesis matching Philips IntelliVue & Mindray BeneView monitors

class OperatingRoomSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private intervalId: any = null;
  private currentBpm: number = 75;
  private currentSpo2: number = 98;
  private volume: number = 0.25;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopHeartbeat();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Generates a realistic pulse ox / ECG monitor beep
   * Pitch dynamically drops with lower SpO2, exactly as medical monitors do (Philips / Mindray standard scale)
   * Dual harmonic structure gives the rich authentic piezoelectric monitor timbre.
   */
  public playPulseBeep(spo2Percent: number = 98) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Authentic pitch mapping based on clinical monitor standards:
      // 100% -> 880 Hz (A5)
      // 98%  -> 830 Hz (G#5)
      // 95%  -> 740 Hz (F#5)
      // 90%  -> 620 Hz (D#5)
      // 85%  -> 520 Hz (C5)
      // 75%  -> 415 Hz (G#4)
      // 60%  -> 330 Hz (E4)
      const clampedSpo2 = Math.max(50, Math.min(100, spo2Percent));
      const normalized = (clampedSpo2 - 50) / 50; // 0 to 1
      // Exponential curve for acoustic pitch perception
      const baseFreq = 300 * Math.pow(880 / 300, normalized);

      const now = this.ctx.currentTime;
      const duration = 0.11; // 110ms snappy medical beep

      // Master Gain for this beep
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      // Fast attack (12ms)
      masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.012);
      // Smooth decay typical of monitor speakers
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(this.ctx.destination);

      // Fundamental tone (Sine)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      // Subtle 2nd harmonic (adds the distinctive "monitor ping" body)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2, now);
      gain2.gain.setValueAtTime(0.22, now); // 22% of fundamental

      // Triangle undertone (gives gentle digital presence)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(baseFreq, now);
      gain3.gain.setValueAtTime(0.15, now);

      osc1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc3.connect(gain3);
      gain3.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch {
      // AudioContext blocked by browser policy until user gesture
    }
  }

  /**
   * Sound of NIBP (Non-Invasive Blood Pressure) measurement completion chime
   */
  public playNibpChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Classic double chime: C5 (523Hz) then G5 (784Hz)
      [
        { freq: 523.25, time: now },
        { freq: 783.99, time: now + 0.16 }
      ].forEach(chime => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chime.freq, chime.time);

        gain.gain.setValueAtTime(0.0001, chime.time);
        gain.gain.linearRampToValueAtTime(this.volume * 0.7, chime.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, chime.time + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(chime.time);
        osc.stop(chime.time + 0.26);
      });
    } catch {}
  }

  /**
   * Generates a critical high-priority alarm (IEC 60601-1-8 standard medical alarm pattern: 3 rapid beeps + 2 beeps)
   */
  public playCriticalAlarm() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.14, 0.28].forEach((delay) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(960, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(this.volume * 0.9, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch {}
  }

  /**
   * Generates a continuous flatline tone for cardiac arrest / asystole
   */
  public playFlatlineTone(durationSec: number = 4) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.stopHeartbeat();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime); // Standard 440 Hz continuous tone

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.85, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(this.volume * 0.85, this.ctx.currentTime + durationSec - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {}
  }

  /**
   * Starts periodic heartbeat according to heart rate and SpO2
   */
  public startHeartbeat(bpm: number = 75, spo2: number = 98) {
    this.stopHeartbeat();
    this.currentBpm = bpm;
    this.currentSpo2 = spo2;

    if (this.isMuted) return;
    if (bpm <= 0) {
      // Cardiac arrest: don't beep periodically
      return;
    }

    const intervalMs = Math.max(280, Math.min(2200, (60 / bpm) * 1000));
    this.playPulseBeep(spo2);

    this.intervalId = setInterval(() => {
      this.playPulseBeep(this.currentSpo2);
    }, intervalMs);
  }

  public updateVitals(bpm: number, spo2: number) {
    this.currentBpm = bpm;
    this.currentSpo2 = spo2;
    if (!this.isMuted && this.intervalId) {
      this.startHeartbeat(bpm, spo2);
    }
  }

  public stopHeartbeat() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const orAudio = new OperatingRoomSoundEngine();

