import { useRef } from 'react'
import { useWedding } from '../../hooks/useWedding'

const FILL = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

export default function PhotoSlot({ slotKey, label, replaceStyle }) {
  const { content, admin, replaceSlot } = useWedding()
  const inputRef = useRef(null)
  const src = content?.images?.[slotKey]

  return (
    <>
      {src
        ? <img src={src} alt="" style={FILL} />
        : <span style={{ font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a7167' }}>{label}</span>}
      {admin && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              position: 'absolute', zIndex: 5, border: 0, background: '#3b302b', color: '#f6ece7',
              font: '10px/1 Jost, sans-serif', letterSpacing: '.1em', padding: '8px 12px', borderRadius: 99, cursor: 'pointer',
              ...replaceStyle,
            }}
          >
            Reemplazar
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) replaceSlot(slotKey, f)
              e.target.value = ''
            }}
          />
        </>
      )}
    </>
  )
}
