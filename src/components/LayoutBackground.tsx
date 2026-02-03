'use client'

import dynamic from 'next/dynamic'

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), {
  ssr: false,
  loading: () => null
})

interface LayoutBackgroundProps {
  children: React.ReactNode
}

export default function LayoutBackground({ children }: LayoutBackgroundProps) {
  return (
    <>
      {/* Fixed background that covers entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ParticleCanvas />
        
        {/* Subtle Aurora Background */}
        <div className="aurora-bg"></div>
        <div className="hero-vignette" aria-hidden></div>
        <div className="hero-noise" aria-hidden></div>
      </div>
      
      {/* Content on top */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}