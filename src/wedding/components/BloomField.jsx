import { useMemo } from 'react'

const PETALS = ['#f6e2df', '#efd2ce', '#f2dcd8', '#e8bfba', '#faeae7', '#f5ead0', '#a34450']
const EDGE = {
  '#f6e2df': '#c98f8b', '#efd2ce': '#b87b78', '#f2dcd8': '#c2837f', '#e8bfba': '#a86a67',
  '#faeae7': '#cf9b96', '#f5ead0': '#c4a86a', '#a34450': '#6d2129',
}
const CORE = ['#f3e0a8', '#f5ead0', '#e9d79a']
const PETAL_PATH = 'M30 28 C 22.5 21, 22 10.5, 30 4 C 38 10.5, 37.5 21, 30 28 Z'

function rnd(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function Bloom({ cfg }) {
  const petals = []
  for (let k = 0; k < cfg.petals; k++) {
    const rot = `rotate(${k * (360 / cfg.petals)} 30 28)`
    petals.push(
      <path key={`p${k}`} d={PETAL_PATH} fill={cfg.petal} stroke={cfg.edge} strokeWidth={0.7} strokeLinejoin="round" opacity={0.96} transform={rot} />
    )
    petals.push(
      <path key={`v${k}`} d="M30 25 L30 9" fill="none" stroke={cfg.edge} strokeWidth={0.45} opacity={0.42} strokeLinecap="round" transform={rot} />
    )
  }
  return (
    <div style={{ position: 'absolute', width: cfg.w + 'px', height: cfg.w + 'px', pointerEvents: 'none', ...cfg.pos, transform: cfg.rot, transformOrigin: cfg.origin }}>
      <svg viewBox="0 0 60 56" width="100%" height="100%" style={{ overflow: 'visible' }}>
        <g className="wf-bloom-leaf" transform={`rotate(${cfg.leafRot} 46 36)`} style={{ animation: `wf-leafPop ${cfg.dur}s ease-out ${cfg.delay + 0.15}s infinite both`, transformBox: 'fill-box', transformOrigin: 'left center' }}>
          <path d="M37 36 C 41 31.5, 50 31.5, 55 36 C 50 40.5, 41 40.5, 37 36 Z" fill={cfg.leaf} stroke="#5c6349" strokeWidth={0.55} opacity={0.95} />
          <path d="M37.5 36 L54.5 36" stroke="#5c6349" strokeWidth={0.45} opacity={0.5} fill="none" />
        </g>
        <g className="wf-bloom-head" style={{ animation: `wf-bloomIn ${cfg.dur}s ease-in-out ${cfg.delay}s infinite both`, transformBox: 'fill-box', transformOrigin: 'center' }}>
          {petals}
          <circle cx={30} cy={28} r={4.4} fill={cfg.core} />
          <circle cx={30} cy={28} r={4.4} fill="none" stroke={cfg.edge} strokeWidth={0.5} opacity={0.5} />
          <circle cx={28.6} cy={26.8} r={0.75} fill={cfg.edge} opacity={0.5} />
          <circle cx={31.3} cy={27.6} r={0.7} fill={cfg.edge} opacity={0.42} />
          <circle cx={30} cy={29.8} r={0.7} fill={cfg.edge} opacity={0.45} />
        </g>
      </svg>
    </div>
  )
}

function makeEdge(side, count, startK) {
  const out = []
  let k = startK
  for (let i = 0; i < count; i++) {
    const r1 = rnd(k + 1), r2 = rnd(k + 91), r3 = rnd(k + 173), r4 = rnd(k + 251)
    const p = ((i + 0.5) / count) * 100 + (r1 - 0.5) * 5
    const petal = PETALS[Math.floor(r1 * PETALS.length)]
    const cfg = {
      w: 22 + r2 * 36,
      dur: 2.6 + r3 * 1.8,
      delay: +(r4 * 3.4).toFixed(2),
      petal,
      edge: EDGE[petal],
      core: CORE[Math.floor(r2 * CORE.length)],
      petals: r3 > 0.62 ? 6 : (r3 < 0.2 ? 8 : 5),
      leaf: r2 > 0.5 ? '#6b7355' : '#7d8a63',
      leafRot: 10 + r3 * 40,
    }
    const tilt = (r3 - 0.5) * 24
    const off = (-6 - r2 * 10) + 'px'
    if (side === 'b') { cfg.pos = { left: p + '%', bottom: off }; cfg.rot = `rotate(${tilt}deg)`; cfg.origin = 'center' }
    if (side === 't') { cfg.pos = { left: p + '%', top: off }; cfg.rot = `rotate(${180 + tilt}deg)`; cfg.origin = 'center' }
    out.push({ cfg, key: `b${k}` })
    k++
  }
  return out
}

export default function BloomField() {
  const blooms = useMemo(() => [...makeEdge('b', 34, 0), ...makeEdge('t', 34, 34)], [])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blooms.map((b) => <Bloom key={b.key} cfg={b.cfg} />)}
    </div>
  )
}
