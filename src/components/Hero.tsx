'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

export default function Hero() {
    const comp = useRef<HTMLDivElement | null>(null)
    const bgTextRef = useRef<HTMLDivElement | null>(null)
    const fgTextRef = useRef<HTMLDivElement | null>(null)

    const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

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
                .from('.hero-x', {
                    scale: 0.95,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                }, '-=1')

            gsap.timeline({
                scrollTrigger: {
                    trigger: comp.current,
                    start: 'top top',
                    end: 'bottom+=120% top',
                    scrub: 0.6,
                },
            })
                .to(bgTextRef.current, {
                    scale: 1.08,
                    rotation: -6,
                    filter: 'blur(2px) brightness(0.92)',
                    ease: 'none',
                }, 0)
                .to(fgTextRef.current, {
                    scale: 1.16,
                    rotation: 9,
                    letterSpacing: '-0.08em',
                    ease: 'none',
                }, 0)
                .to('.hero-desc', {
                    y: -20,
                    opacity: 0.92,
                    ease: 'none',
                }, 0)
                .to('.hero-btn', {
                    y: -10,
                }, 0)

        }, comp)

        let rafId = 0
        let bgY = 0
        let fgY = 0

        const update = () => {
            const scrollY = window.scrollY || 0
            const targetBg = scrollY * 0.08
            const targetFg = scrollY * 0.16

            bgY = lerp(bgY, targetBg, 0.08)
            fgY = lerp(fgY, targetFg, 0.12)

            if (bgTextRef.current) gsap.set(bgTextRef.current, { y: bgY })
            if (fgTextRef.current) gsap.set(fgTextRef.current, { y: fgY })

            rafId = requestAnimationFrame(update)
        }

        rafId = requestAnimationFrame(update)

        return () => {
            ctx.revert()
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <section ref={comp} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-32 selection:bg-blue-500/30 selection:text-white">
            <div className="aurora-bg"></div>
            <div className="hero-vignette" aria-hidden></div>
            <div className="hero-noise" aria-hidden></div>

            <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <div ref={bgTextRef} className="hero-bg-text">90&apos;s</div>
                <div ref={fgTextRef} className="hero-fg-text hero-x">X</div>
            </div>

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">
                <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="glass px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wide uppercase text-gray-300 border border-white/10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Crafted for the 90&apos;s X
                    </div>
                </div>

                <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight mb-8 text-center leading-[1] max-w-5xl mx-auto">
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent pb-4">Silver future,</span>
                    </div>
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent pb-4">born in the 90&apos;s.</span>
                    </div>
                </h1>

                <p className="hero-desc text-xl md:text-3xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-center font-normal tracking-wide">
                    A cinematic hero with layered parallax: the 90s behind, the X upfront. Subtle delay keeps the motion silky as you scroll.
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
