'use client'

import { ReactLenis } from 'lenis/react'

export default function SmoothScroll({ children }: { children: any }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.2,
                duration: 0.7,
                smoothWheel: true,
                wheelMultiplier: 1.2,
                touchMultiplier: 1.1,
            }}
        >
            {children}
        </ReactLenis>
    )
}
