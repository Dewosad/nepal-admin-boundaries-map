import { memo } from 'react'

interface Props {
  district: string[]
  selected: string | null
  onSelect: (p: string | null) => void
}

export default memo(function DistrictSelector({ district, selected, onSelect }: Props) {
  return (
      <select
        className="w-full border rounded px-2 py-1"
        value={selected ?? ''}
        onChange={e => onSelect(e.target.value || null)}
      >
        <option value="">Show all</option>
        {district.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
  )
})