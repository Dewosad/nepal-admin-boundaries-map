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
      className="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
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
