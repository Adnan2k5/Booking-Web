import React from 'react'

export const Loader = ({btn}) => {
  return (
    <div className={`w-full ${btn ? `` : `h-[100vh]`} flex justify-center items-center`}>
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}
