import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const steps = [
  { icon: ScanLineIcon, label: 'Analyzing your request...' },
  { icon: SquareIcon, label: 'Generating layout structure...' },
  { icon: TriangleIcon, label: 'Assembling UI components...' },
  { icon: CircleIcon, label: 'Finalizing your website...' },
]

const STEP_DURATION = 45000

/**
 * Loader animation shown during AI generation
 */
const LoaderSteps = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s) => (s + 1) % steps.length)
    }, STEP_DURATION)

    return () => clearInterval(interval)
  }, [])

  const Icon = steps[current].icon

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-white">
      <Icon className="w-8 h-8 animate-bounce" />
      <p className="mt-6 text-lg">{steps[current].label}</p>
    </div>
  )
}

export default LoaderSteps
