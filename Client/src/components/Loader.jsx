import React from 'react'

export const Loader = ({ btn }) => {
  return (
    <div className={`w-full ${btn ? `` : `h-[100vh]`} flex justify-center items-center bg-white`}>
      <span className="text-sm font-medium">Loading...</span>
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <p className="text-sm font-medium tracking-[0.3em] text-gray-500 uppercase">
          Loading
        </p>
      </div>
    </div>
  )
}
