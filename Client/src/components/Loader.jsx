import React from 'react'

export const Loader = ({btn}) => {
  return (
    <div className={`w-full ${btn ? `` : `h-[100vh]`} flex justify-center items-center`}>
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  )
}
