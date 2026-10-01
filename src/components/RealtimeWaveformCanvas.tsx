import React, { useRef, useEffect } from 'react';

interface WaveformProps {
  fc: number; // Heart rate in bpm
  spo2: number; // SpO2 in %
  etco2: number; // EtCO2 in mmHg
  fr: number; // Respiratory rate in rpm
  ecgStripType?: string; // 'normal' | 'fibrillation' | 'severe-brady' | 'sinus-tach'
  hasBronchospasm?: boolean; // Shark-fin capnogram
  isFlatline?: boolean; // Cardiac arrest
  height?: number;
}

export const RealtimeWaveformCanvas: React.FC<WaveformProps> = ({
  fc = 75,
  spo2 = 98,
  etco2 = 38,
  fr = 14,
  ecgStripType = 'normal',
  hasBronchospasm = false,
  isFlatline = false,
  height = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sweepX = 0;
    const sweepWidth = 18; // Erase sweep gap width

    // State for waveform generators
    let ecgPhase = 0;
    let plethPhase = 0;
    let capnoPhase = 0;

    // Buffer arrays for persistence
    const width = canvas.width;
    const ecgBuffer = new Float32Array(width);
    const plethBuffer = new Float32Array(width);
    const capnoBuffer = new Float32Array(width);

    // Initial zero lines
    for (let i = 0; i < width; i++) {
      ecgBuffer[i] = 0;
      plethBuffer[i] = 0;
      capnoBuffer[i] = 0;
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // capped delta
      lastTime = time;

      // Speeds: standard 25 mm/s monitor sweep
      const sweepSpeedPxPerSec = width / 6; // 6 seconds to cross screen
      const step = sweepSpeedPxPerSec * dt;
      const prevSweepX = sweepX;
      sweepX = (sweepX + step) % width;

      // Frequencies
      const heartFreq = isFlatline || fc <= 0 ? 0 : fc / 60; // Hz
      const respFreq = fr <= 0 ? 0 : fr / 60; // Hz

      // Calculate how many pixel columns to update this frame
      const startX = Math.floor(prevSweepX);
      const count = Math.ceil(step) + 1;

      for (let i = 0; i < count; i++) {
        const currentX = (startX + i) % width;
        const subDt = dt / count;

        // Advance phases
        ecgPhase = (ecgPhase + heartFreq * subDt * Math.PI * 2) % (Math.PI * 2);
        plethPhase = (plethPhase + heartFreq * subDt * Math.PI * 2) % (Math.PI * 2);
        capnoPhase = (capnoPhase + respFreq * subDt * Math.PI * 2) % (Math.PI * 2);

        // 1. Compute ECG value [-1 to 1]
        let ecgVal = 0;
        if (isFlatline || fc <= 0) {
          ecgVal = (Math.random() - 0.5) * 0.03; // Faint flatline electrical noise
        } else if (ecgStripType === 'fibrillation') {
          // Chaotic ventricular fibrillation (sum of multiple desynchronized sinusoids + noise)
          const t = time * 0.006 + currentX * 0.08;
          ecgVal = (
            Math.sin(t * 3.1) * 0.45 +
            Math.sin(t * 5.7) * 0.35 +
            Math.sin(t * 1.9 + 1.2) * 0.25 +
            (Math.random() - 0.5) * 0.15
          );
        } else {
          // Standard cardiac cycle (P-Q-R-S-T)
          const p = ecgPhase; // 0 to 2*PI
          // P wave (around 0.15 * 2PI)
          const pWave = Math.exp(-Math.pow((p - 0.9) / 0.18, 2)) * 0.18;
          // Q dip (around 0.30 * 2PI)
          const qWave = -Math.exp(-Math.pow((p - 1.6) / 0.06, 2)) * 0.15;
          // R spike (around 0.33 * 2PI)
          const rWave = Math.exp(-Math.pow((p - 1.75) / 0.05, 2)) * 1.0;
          // S dip (around 0.36 * 2PI)
          const sWave = -Math.exp(-Math.pow((p - 1.9) / 0.07, 2)) * 0.35;
          // T wave (around 0.55 * 2PI)
          const tWave = Math.exp(-Math.pow((p - 3.2) / 0.45, 2)) * 0.32;

          ecgVal = pWave + qWave + rWave + sWave + tWave;
          // Slight baseline baseline drift
          ecgVal += Math.sin(time * 0.001) * 0.03;
        }
        ecgBuffer[currentX] = ecgVal;

        // 2. Compute Pleth / SpO2 pulse wave [0 to 1]
        let plethVal = 0;
        if (isFlatline || fc <= 0) {
          plethVal = (Math.random() - 0.5) * 0.02;
        } else {
          // Pulse wave with rapid systolic upstroke, dicrotic notch, and diastolic runoff
          const p = plethPhase;
          // Systolic peak
          const systolic = Math.exp(-Math.pow((p - 1.9) / 0.4, 2)) * 0.95;
          // Dicrotic notch
          const dicrotic = Math.exp(-Math.pow((p - 3.1) / 0.35, 2)) * 0.35;
          plethVal = Math.max(0, systolic + dicrotic);
          // Scale by SpO2 (severe desat dampens peripheral signal)
          plethVal *= Math.min(1, Math.max(0.3, spo2 / 95));
        }
        plethBuffer[currentX] = plethVal;

        // 3. Compute Capnogram (EtCO2) [0 to 1]
        let capnoVal = 0;
        if (fr <= 0 || etco2 <= 0) {
          capnoVal = 0;
        } else {
          const p = capnoPhase / (Math.PI * 2); // 0 to 1
          // Phase I: Inspiration (baseline at 0) from p=0.0 to 0.35
          // Phase II: Rapid expiratory upstroke from p=0.35 to 0.45
          // Phase III: Alveolar plateau from p=0.45 to 0.85
          // Phase IV: Inspiratory downstroke from p=0.85 to 0.95
          if (p < 0.35) {
            capnoVal = 0;
          } else if (p >= 0.35 && p < 0.44) {
            // Rapid S-shaped ascent
            const t = (p - 0.35) / 0.09;
            capnoVal = t * t * (3 - 2 * t);
          } else if (p >= 0.44 && p < 0.84) {
            if (hasBronchospasm || ecgStripType === 'sinus-tach') {
              // Classic "shark fin" (aleta de tiburón): upward sloping prolonged alveolar phase
              const t = (p - 0.44) / 0.40;
              capnoVal = 0.55 + t * 0.45;
            } else {
              // Normal horizontal alveolar plateau
              const t = (p - 0.44) / 0.40;
              capnoVal = 0.92 + t * 0.08;
            }
          } else {
            // Steep inspiratory descent
            const t = (p - 0.84) / 0.10;
            capnoVal = Math.max(0, 1 - t * 2.5);
          }
          // Scale by actual EtCO2 value (normal = 40)
          capnoVal *= Math.min(1.2, etco2 / 40);
        }
        capnoBuffer[currentX] = capnoVal;
      }

      // Draw everything on canvas
      ctx.clearRect(0, 0, width, canvas.height);

      // Grid background (classic medical 5mm grid)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Channel heights
      const totalH = canvas.height;
      const ch1Y = totalH * 0.22; // ECG center
      const ch2Y = totalH * 0.58; // Pleth baseline
      const ch3Y = totalH * 0.92; // Capno baseline

      // Erase gap zone (phosphor sweep beam)
      const eraseStart = sweepX;
      const eraseEnd = (sweepX + sweepWidth) % width;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
      if (eraseStart < eraseEnd) {
        ctx.fillRect(eraseStart, 0, sweepWidth, canvas.height);
      } else {
        ctx.fillRect(eraseStart, 0, width - eraseStart, canvas.height);
        ctx.fillRect(0, 0, eraseEnd, canvas.height);
      }

      // Sweep glow bar (vertical neon phosphor head)
      const grad = ctx.createLinearGradient(sweepX, 0, sweepX + 4, 0);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.8)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sweepX, 0, 4, canvas.height);

      // Helper to draw segmented path skipping erase gap
      const drawChannel = (
        buffer: Float32Array,
        baselineY: number,
        scaleY: number,
        color: string,
        lineWidth: number,
        fillBottom?: boolean
      ) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;

        // Draw left of sweep gap
        const drawSegment = (fromX: number, toX: number) => {
          if (toX <= fromX) return;
          ctx.beginPath();
          let started = false;
          for (let x = fromX; x <= toX; x++) {
            const y = baselineY - buffer[x] * scaleY;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();

          if (fillBottom && started) {
            ctx.lineTo(toX, baselineY);
            ctx.lineTo(fromX, baselineY);
            ctx.closePath();
            ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', ', 0.15)');
            ctx.shadowBlur = 0;
            ctx.fill();
          }
        };

        const safeGap = sweepWidth + 2;
        if (sweepX + safeGap < width) {
          // Segment 1: from sweepX + safeGap to width - 1
          drawSegment(Math.floor(sweepX + safeGap), width - 1);
          // Segment 2: from 0 to sweepX - 2
          drawSegment(0, Math.max(0, Math.floor(sweepX - 2)));
        } else {
          // Wrapping gap
          const wrapEnd = (sweepX + safeGap) % width;
          drawSegment(Math.ceil(wrapEnd), Math.max(0, Math.floor(sweepX - 2)));
        }

        ctx.restore();
      };

      // 1. Draw ECG (Emerald Green)
      drawChannel(ecgBuffer, ch1Y, totalH * 0.16, '#10b981', 2);

      // 2. Draw Pleth / SpO2 (Amber Yellow)
      drawChannel(plethBuffer, ch2Y, totalH * 0.16, '#f59e0b', 2, true);

      // 3. Draw Capnogram (Soft Purple / Violet)
      drawChannel(capnoBuffer, ch3Y, totalH * 0.20, '#c084fc', 2, true);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fc, spo2, etco2, fr, ecgStripType, hasBronchospasm, isFlatline]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
      <canvas
        ref={canvasRef}
        width={900}
        height={height}
        className="w-full block"
        style={{ height: `${height}px`, imageRendering: 'auto' }}
      />
    </div>
  );
};
