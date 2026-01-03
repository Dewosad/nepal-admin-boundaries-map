import React from 'react'

const Legend = () => {
  return (
       <div className="absolute bottom-8 right-4 bg-transparent backdrop-blur-md border border-gray-400 shadow-2xl bg-opacity-90 p-3 rounded z-50">
    <h4 className="font-bold text-sm mb-2">Legend</h4>
    <div className="flex items-center mb-1">
      <span className="w-4 h-4 bg-red-500 mr-2 block"></span>
      High Risk
    </div>
    <div className="flex items-center mb-1">
      <span className="w-4 h-4 bg-yellow-400 mr-2 block"></span>
      Medium Risk
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 bg-green-500 mr-2 block"></span>
      Low Risk
    </div>
  </div>
  )
}

export default Legend
