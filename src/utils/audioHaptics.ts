/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundHapticService {
  private audioCtx: AudioContext | null = null;
  public soundEnabled = true;
  public hapticEnabled = true;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  public playKeyClick(type: 'num' | 'op' | 'action' | 'error' = 'num') {
    if (this.hapticEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'action') {
          navigator.vibrate([15, 30, 20]);
        } else if (type === 'error') {
          navigator.vibrate([40, 40, 60]);
        } else {
          navigator.vibrate(10);
        }
      } catch {
        // Ignore vibration errors
      }
    }

    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      if (type === 'num') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      } else if (type === 'op') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      } else if (type === 'action') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      } else {
        // error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      }

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + (type === 'error' ? 0.12 : 0.06));
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const soundHaptics = new SoundHapticService();
