// Ambient soundscapes synthesized entirely with the Web Audio API — no
// external audio files to fetch or bundle, so it works offline and stays
// tiny.

import type { IconName } from '../components/Icon'

export type SoundscapeKind = 'rain' | 'ocean' | 'wind' | 'bowl' | 'whitenoise' | 'silence' | 'breathing' | 'bell'

export const SOUNDSCAPES: { kind: SoundscapeKind; name: string; icon: IconName }[] = [
  { kind: 'rain', name: 'Rain', icon: 'cloudRain' },
  { kind: 'ocean', name: 'Ocean', icon: 'waves' },
  { kind: 'wind', name: 'Forest Wind', icon: 'wind' },
  { kind: 'bowl', name: 'Singing Bowl', icon: 'bowl' },
  { kind: 'breathing', name: 'Breathing', icon: 'activity' },
  { kind: 'bell', name: 'Interval Bell', icon: 'bell' },
  { kind: 'whitenoise', name: 'White Noise', icon: 'waveform' },
  { kind: 'silence', name: 'Silence', icon: 'moon' },
]

export const BREATH_CYCLE_SECONDS = 4

function makeNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

interface ActiveGraph {
  nodes: AudioNode[]
  stop: () => void
}

export class SoundscapePlayer {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private active: ActiveGraph | null = null

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.5
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  setVolume(v: number) {
    if (this.masterGain) this.masterGain.gain.value = v
  }

  /** `onBreathPhase` is called immediately with 'in', then again with
   * alternating 'in'/'out' every BREATH_CYCLE_SECONDS — only relevant for
   * the 'breathing' kind, ignored otherwise. Lets the UI show matching text. */
  play(kind: SoundscapeKind, onBreathPhase?: (phase: 'in' | 'out') => void) {
    this.stop()
    if (kind === 'silence') return
    const ctx = this.ensureContext()
    const master = this.masterGain!
    const nodes: AudioNode[] = []

    if (kind === 'breathing') {
      const cycleMs = BREATH_CYCLE_SECONDS * 1000
      const chime = (freq: number) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        const gain = ctx.createGain()
        gain.gain.value = 0
        osc.connect(gain)
        gain.connect(master)
        osc.start()
        const t = ctx.currentTime
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.3, t + 0.6)
        gain.gain.linearRampToValueAtTime(0, t + cycleMs / 1000 - 0.3)
        window.setTimeout(() => {
          try {
            osc.stop()
          } catch {
            /* noop */
          }
          osc.disconnect()
          gain.disconnect()
        }, cycleMs)
      }
      let phase: 'in' | 'out' = 'in'
      chime(330)
      onBreathPhase?.(phase)
      const interval = window.setInterval(() => {
        phase = phase === 'in' ? 'out' : 'in'
        chime(phase === 'in' ? 330 : 220)
        onBreathPhase?.(phase)
      }, cycleMs)
      this.active = { nodes: [], stop: () => window.clearInterval(interval) }
      return
    }

    if (kind === 'bell') {
      const strike = () => {
        const t = ctx.currentTime
        const partials = [1, 2.4, 3.8]
        partials.forEach((ratio, i) => {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = 440 * ratio
          const gain = ctx.createGain()
          const peak = i === 0 ? 0.4 : 0.15
          gain.gain.setValueAtTime(peak, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 4)
          osc.connect(gain)
          gain.connect(master)
          osc.start(t)
          osc.stop(t + 4)
        })
      }
      strike()
      const interval = window.setInterval(strike, 60000)
      this.active = { nodes: [], stop: () => window.clearInterval(interval) }
      return
    }

    if (kind === 'whitenoise' || kind === 'rain' || kind === 'ocean' || kind === 'wind') {
      const noise = ctx.createBufferSource()
      noise.buffer = makeNoiseBuffer(ctx)
      noise.loop = true
      nodes.push(noise)

      let node: AudioNode = noise

      if (kind === 'rain') {
        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'
        hp.frequency.value = 700
        const lp = ctx.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 6000
        noise.connect(hp)
        hp.connect(lp)
        node = lp
        nodes.push(hp, lp)
      } else if (kind === 'ocean') {
        const lp = ctx.createBiquadFilter()
        lp.type = 'lowpass'
        lp.frequency.value = 900
        noise.connect(lp)
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = 0.5
        const lfo = ctx.createOscillator()
        lfo.frequency.value = 0.15
        const lfoDepth = ctx.createGain()
        lfoDepth.gain.value = 0.5
        lfo.connect(lfoDepth)
        lfoDepth.connect(lfoGain.gain)
        lp.connect(lfoGain)
        lfo.start()
        node = lfoGain
        nodes.push(lp, lfo, lfoGain, lfoDepth)
      } else if (kind === 'wind') {
        const bp = ctx.createBiquadFilter()
        bp.type = 'bandpass'
        bp.frequency.value = 500
        bp.Q.value = 0.6
        noise.connect(bp)
        const lfo = ctx.createOscillator()
        lfo.frequency.value = 0.08
        const lfoDepth = ctx.createGain()
        lfoDepth.gain.value = 300
        lfo.connect(lfoDepth)
        lfoDepth.connect(bp.frequency)
        lfo.start()
        node = bp
        nodes.push(bp, lfo, lfoDepth)
      }

      const gain = ctx.createGain()
      gain.gain.value = kind === 'rain' ? 0.35 : kind === 'ocean' ? 0.6 : 0.3
      node.connect(gain)
      gain.connect(master)
      nodes.push(gain)
      noise.start()
    } else if (kind === 'bowl') {
      const freqs = [136.1, 272.2, 408.3]
      const gains: GainNode[] = []
      for (const f of freqs) {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = f
        const g = ctx.createGain()
        g.gain.value = 0
        osc.connect(g)
        g.connect(master)
        osc.start()
        nodes.push(osc, g)
        gains.push(g)
      }
      const now = ctx.currentTime
      gains.forEach((g, i) => {
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(i === 0 ? 0.5 : 0.15, now + 3)
      })

      const strike = () => {
        const t = ctx!.currentTime
        gains.forEach((g, i) => {
          const peak = i === 0 ? 0.55 : 0.18
          g.gain.cancelScheduledValues(t)
          g.gain.setValueAtTime(g.gain.value, t)
          g.gain.linearRampToValueAtTime(peak, t + 0.3)
          g.gain.exponentialRampToValueAtTime(0.02, t + 9)
        })
      }
      strike()
      const interval = window.setInterval(strike, 11000)
      this.active = {
        nodes,
        stop: () => {
          window.clearInterval(interval)
          nodes.forEach((n) => {
            try {
              ;(n as OscillatorNode).stop?.()
            } catch {
              /* noop */
            }
            n.disconnect()
          })
        },
      }
      return
    }

    this.active = {
      nodes,
      stop: () => {
        nodes.forEach((n) => {
          try {
            ;(n as AudioBufferSourceNode).stop?.()
          } catch {
            /* noop */
          }
          try {
            ;(n as OscillatorNode).stop?.()
          } catch {
            /* noop */
          }
          n.disconnect()
        })
      },
    }
  }

  stop() {
    this.active?.stop()
    this.active = null
  }
}
