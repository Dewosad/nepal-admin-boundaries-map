import { memo } from 'react'

interface Props {
  admin: string[]
  selected: string | null
  onSelect: (p: string | null) => void
  disabled?: boolean
}

export default memo(function Selector({ admin, selected, onSelect, disabled = false }: Props) {
  return (
    <select
      className="w-full border rounded px-2 py-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
      value={selected ?? ''}
      onChange={e => onSelect(e.target.value || null)}
      disabled={disabled}
    >
      <option value="">Show all</option>
      {admin.map(p => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
  )
})