interface ToggleButtonProps {
  isActive: boolean
  onClick: () => void
}

const ToggleButton = ({ isActive, onClick }: ToggleButtonProps) => {
  return (
    <button
      type="button"
      className={`h-5 w-9 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-slate-900' : 'bg-slate-300'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span
        className={`bg-white h-4 w-4 rounded-full shadow transform transition-transform duration-200 ${
          isActive ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default ToggleButton
