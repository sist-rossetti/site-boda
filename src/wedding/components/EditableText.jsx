import { useWedding } from '../../hooks/useWedding'

export default function EditableText({ as: Tag = 'p', value, onSave, style, ...rest }) {
  const { admin } = useWedding()

  return (
    <Tag
      contentEditable={admin}
      suppressContentEditableWarning
      style={style}
      onBlur={(e) => {
        if (!admin) return
        const text = e.target.innerText.trim()
        if (text !== value) onSave(text)
      }}
      {...rest}
    >
      {value}
    </Tag>
  )
}
