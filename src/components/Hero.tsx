'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

export default function Hero() {
    const comp = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            tl.from('.hero-text-1', {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power4.out',
                stagger: 0.2,
            })
                .from('.hero-desc', {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                }, '-=0.5')
                .from('.hero-btn', {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: 0.1,
                }, '-=0.4')
                .from('.hero-blob', {
                    scale: 0,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'elastic.out(1, 0.5)',
                }, '-=1.2')

        }, comp)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={comp} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 selection:bg-blue-500/30 selection:text-white">
            {/* Subtle Aurora Background - Apple Style */}
            <div className="aurora-bg"></div>

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">

                {/* Badge */}
                <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="glass px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wide uppercase text-gray-300 border border-white/10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Introducing 90sX
                    </div>
                </div>

                <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight mb-8 text-center leading-[1] max-w-5xl mx-auto">
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-4">Precision in</span>
                    </div>
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent pb-4">Every Pixel.</span>
                    </div>
                </h1>

                <p className="hero-desc text-xl md:text-3xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-center font-normal tracking-wide">
                    We craft digital experiences that feel inevitable. <br className="hidden md:block" />
                    Simple. Powerful. Timeless.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                    <Link href="#contact" className="hero-btn group relative px-8 py-4 bg-white text-black text-sm font-semibold rounded-full overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center shadow-lg hover:shadow-xl">
                        Start a Project
                    </Link>
                    <Link href="#projects" className="hero-btn group px-8 py-4 glass text-white text-sm font-medium rounded-full hover:bg-white/10 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center">
                        View Our Work
                    </Link>
                </div>
            </div>
        </section>
    )
}
