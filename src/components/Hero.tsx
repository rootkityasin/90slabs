'use client'

import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

interface HeroData {
    headline1: string
    headline2: string
    description: string
    primaryCta: {
        text: string
        href: string
    }
    secondaryCta: {
        text: string
        href: string
    }
}

export default function Hero() {
    const comp = useRef<HTMLDivElement | null>(null)
    const bgTextRef = useRef<HTMLDivElement | null>(null)
    const fgTextRef = useRef<HTMLDivElement | null>(null)
    const [data, setData] = useState<HeroData | null>(null)
    const [loading, setLoading] = useState(true)

    const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/hero')
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                } else {
                    // Fallback to default content
                    setData({
                        headline1: "Precision in",
                        headline2: "Every Pixel.",
                        description: "We craft digital experiences that feel inevitable. Simple. Powerful. Timeless.",
                        primaryCta: { text: "Start a Project", href: "#contact" },
                        secondaryCta: { text: "View Our Work", href: "#projects" }
                    })
                }
            } catch (error) {
                console.error('Error fetching hero:', error)
                // Fallback to default content
                setData({
                    headline1: "Precision in",
                    headline2: "Every Pixel.",
                    description: "We craft digital experiences that feel inevitable. Simple. Powerful. Timeless.",
                    primaryCta: { text: "Start a Project", href: "#contact" },
                    secondaryCta: { text: "View Our Work", href: "#projects" }
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useLayoutEffect(() => {
        if (!data || loading) return

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
        let ticking = false

        // Use quickSetter for better performance
        const setBgY = bgTextRef.current ? gsap.quickSetter(bgTextRef.current, 'y', 'px') : null
        const setFgY = fgTextRef.current ? gsap.quickSetter(fgTextRef.current, 'y', 'px') : null

        const update = () => {
            const scrollY = window.scrollY || 0
            const targetBg = scrollY * 0.06
            const targetFg = scrollY * 0.12

            bgY = lerp(bgY, targetBg, 0.1)
            fgY = lerp(fgY, targetFg, 0.1)

            if (setBgY) setBgY(bgY)
            if (setFgY) setFgY(fgY)

            ticking = false
        }

        const onScroll = () => {
            if (!ticking) {
                rafId = requestAnimationFrame(update)
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        update() // Initial call

        return () => {
            ctx.revert()
            cancelAnimationFrame(rafId)
            window.removeEventListener('scroll', onScroll)
        }
    }, [data, loading])

    if (loading || !data) {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 bg-[#001210]">
                <div className="w-12 h-12 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full animate-spin" />
            </section>
        )
    }

    return (
        <section ref={comp} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 selection:bg-[#008f7d]/30 selection:text-[#FFF4B7]">
            {/* Subtle Aurora Background - Apple Style */}
            <div className="aurora-bg"></div>
            <div className="hero-vignette" aria-hidden></div>
            <div className="hero-noise" aria-hidden></div>

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">
                <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight mb-8 text-center leading-[1] max-w-5xl mx-auto drop-shadow-[0_0_20px_rgba(0,18,16,0.5)]">
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block text-white pb-4">{data.headline1}</span>
                    </div>
                    <div className="overflow-hidden">
                        <span className="hero-text-1 block text-[#FFF4B7] opacity-90 pb-4">{data.headline2}</span>
                    </div>
                </h1>

                <p className="hero-desc text-xl md:text-3xl text-[#FFF4B7]/70 max-w-2xl mx-auto mb-14 leading-relaxed text-center font-normal tracking-wide">
                    {data.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                    <Link href={data.primaryCta.href} className="hero-btn group relative px-8 py-4 bg-[#FFF4B7] text-[#001210] text-sm font-bold rounded-full overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center shadow-[0_0_20px_rgba(255,244,183,0.2)] hover:shadow-[0_0_30px_rgba(255,244,183,0.4)]">
                        {data.primaryCta.text}
                    </Link>
                    <Link href={data.secondaryCta.href} className="hero-btn group px-8 py-4 glass text-white text-sm font-medium rounded-full hover:bg-[#008f7d]/20 border border-[#FFF4B7]/10 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center">
                        {data.secondaryCta.text}
                    </Link>
                </div>
            </div>
        </section>
    )
}
