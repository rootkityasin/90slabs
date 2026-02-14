'use client'

interface LayoutBackgroundProps {
  children: React.ReactNode
}

export default function LayoutBackground({ children }: LayoutBackgroundProps) {
  return (
    <>
      {/* Fixed background that covers entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      </div>

      {/* Content on top */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}