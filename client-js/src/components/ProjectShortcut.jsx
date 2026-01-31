import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProjectShortcut = () => {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <button
        onClick={() => navigate('/')}
        aria-label="Create new project"
        className="
          h-12 w-12 rounded-full
          bg-lime-400 text-black text-2xl font-bold
          flex items-center justify-center
          shadow-lg shadow-lime-400/40
          hover:scale-105 hover:bg-lime-300
          active:scale-95 transition
        "
      >
        +
      </button>

      {/* Tooltip */}
      <span
        className="
          absolute
          right-14
          top-1/2
          -translate-y-1/2

          whitespace-nowrap
          rounded-md
          bg-black
          px-3
          py-1.5
          text-xs
          font-medium
          text-white

          opacity-0
          scale-95
          group-hover:opacity-100
          group-hover:scale-100
          transition
          pointer-events-none
        "
      >
        Create Project
      </span>
    </div>
  )
}

export default ProjectShortcut
