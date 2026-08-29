import { useCallback, useEffect, useRef, useState } from 'react'
import { useWedding } from '../../hooks/useWedding'

const FILL = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
const DEFAULT_POS = { x: 50, y: 50 }

export default function PhotoSlot({ slotKey, label, replaceStyle }) {
  const { content, admin, replaceSlot, setImagePosition } = useWedding()
  const inputRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const src = content?.images?.[slotKey]
  const savedPos = content?.imagePositions?.[slotKey] || DEFAULT_POS
  const [pos, setPos] = useState(savedPos)

  useEffect(() => {
    if (!dragging) setPos(savedPos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPos.x, savedPos.y, dragging])

  const onPointerDown = useCallback((e) => {
    if (!admin || !src || !imgRef.current) return
    e.preventDefault()
    const rect = imgRef.current.getBoundingClientRect()
    dragRef.current = { startX: e.clientX, startY: e.clientY, rectW: rect.width, rectH: rect.height, origin: pos }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [admin, src, pos])

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return
    const { startX, startY, rectW, rectH, origin } = dragRef.current
    const dx = ((e.clientX - startX) / rectW) * 100
    const dy = ((e.clientY - startY) / rectH) * 100
    setPos({
      x: Math.min(100, Math.max(0, origin.x - dx)),
      y: Math.min(100, Math.max(0, origin.y - dy)),
    })
  }, [])

  const onPointerUp = useCallback(() => {
    if (!dragRef.current) return
    dragRef.current = null
    setDragging(false)
    setPos((current) => { setImagePosition(slotKey, current); return current })
  }, [setImagePosition, slotKey])

  return (
    <>
      {src
        ? (
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              ...FILL,
              objectPosition: `${pos.x}% ${pos.y}%`,
              cursor: admin ? (dragging ? 'grabbing' : 'grab') : 'default',
              touchAction: admin ? 'none' : 'auto',
            }}
          />
        )
        : <span style={{ font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.16em', textTransform: 'uppercase', color: '#8a7167' }}>{label}</span>}
      {admin && src && (
        <span style={{ position: 'absolute', bottom: 9, right: 9, zIndex: 4, pointerEvents: 'none', font: '9px/1 Jost, sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: 'rgba(59,48,43,.6)', padding: '5px 9px', borderRadius: 99, opacity: dragging ? 1 : 0.85 }}>
          Arrastrá para ajustar
        </span>
      )}
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
              if (f) {
                replaceSlot(slotKey, f).catch((err) => alert('No se pudo subir la foto: ' + err.message))
              }
              e.target.value = ''
            }}
          />
        </>
      )}
    </>
  )
}
