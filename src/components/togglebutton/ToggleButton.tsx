import React from 'react'

interface ToggleButtonProps {
  isActive: boolean
  onClick: () => void
}

const ToggleButton = ({ isActive, onClick }: ToggleButtonProps) => {
  return (
    <div>
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isActive ? 'bg-green-500' : 'bg-gray-500'
        }`}
        onClick={onClick}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isActive ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  )
}

export default ToggleButton