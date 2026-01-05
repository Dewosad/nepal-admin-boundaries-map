import { memo } from 'react'

interface Props {
  admin: string[]
  selected: string | null
  onSelect: (p: string | null) => void
}

export default memo(function Selector({ admin, selected, onSelect }: Props) {
  return (
      <select
        className="w-full border rounded px-2 py-1"
        value={selected ?? ''}
        onChange={e => onSelect(e.target.value || null)}
      >
        <option value="">Show all</option>
        {admin.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
  )
})