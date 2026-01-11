'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react'
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
    const comp = useRef<HTMLElement | null>(null)
    const [data, setData] = useState<HeroData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    // Wait for component to mount before using scroll
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Use window scroll instead of element-based scroll to avoid hydration issues
    const { scrollY } = useScroll()

    // Parallax transforms for scroll effects (based on window scroll)
    const bgTextY = useTransform(scrollY, [0, 800], [0, 100])
    const bgTextScale = useTransform(scrollY, [0, 800], [1, 1.08])
    const bgTextRotate = useTransform(scrollY, [0, 800], [0, -6])

    const fgTextY = useTransform(scrollY, [0, 800], [0, 150])
    const fgTextScale = useTransform(scrollY, [0, 800], [1, 1.16])
    const fgTextRotate = useTransform(scrollY, [0, 800], [0, 9])

    const descY = useTransform(scrollY, [0, 500], [0, -20])
    const btnY = useTransform(scrollY, [0, 500], [0, -10])

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

    if (loading || !data) {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 bg-[#001210]">
                <div className="w-12 h-12 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full animate-spin" />
            </section>
        )
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    }

    const textVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20
            }
        }
    }

    const descVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 20,
                delay: 0.4
            }
        }
    }

    const buttonVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.6 + i * 0.1
            }
        })
    }

    return (
        <section ref={comp} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 selection:bg-[#008f7d]/30 selection:text-[#FFF4B7]">
            {/* Subtle Aurora Background - Apple Style */}
            <div className="aurora-bg"></div>
            <div className="hero-vignette" aria-hidden></div>
            <div className="hero-noise" aria-hidden></div>

            <motion.div
                className="container px-4 md:px-6 relative z-10 flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-5xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight mb-8 text-center leading-[1] max-w-5xl mx-auto drop-shadow-[0_0_20px_rgba(0,18,16,0.5)]"
                    style={isMounted ? { y: bgTextY, scale: bgTextScale, rotate: bgTextRotate } : undefined}
                >
                    <div className="overflow-hidden">
                        <motion.span
                            className="block text-white pb-4"
                            variants={textVariants}
                        >
                            {data.headline1}
                        </motion.span>
                    </div>
                    <div className="overflow-hidden">
                        <motion.span
                            className="block text-[#FFF4B7] opacity-90 pb-4"
                            variants={textVariants}
                            style={isMounted ? { y: fgTextY, scale: fgTextScale, rotate: fgTextRotate } : undefined}
                        >
                            {data.headline2}
                        </motion.span>
                    </div>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-3xl text-[#FFF4B7]/70 max-w-2xl mx-auto mb-14 leading-relaxed text-center font-normal tracking-wide"
                    variants={descVariants}
                    style={isMounted ? { y: descY } : undefined}
                >
                    {data.description}
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
                    style={isMounted ? { y: btnY } : undefined}
                >
                    <motion.div variants={buttonVariants} custom={0}>
                        <Link href={data.primaryCta.href} className="group relative px-8 py-4 bg-[#FFF4B7] text-[#001210] text-sm font-bold rounded-full overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center shadow-[0_0_20px_rgba(255,244,183,0.2)] hover:shadow-[0_0_30px_rgba(255,244,183,0.4)] inline-block">
                            {data.primaryCta.text}
                        </Link>
                    </motion.div>
                    <motion.div variants={buttonVariants} custom={1}>
                        <Link href={data.secondaryCta.href} className="group px-8 py-4 glass text-white text-sm font-medium rounded-full hover:bg-[#008f7d]/20 border border-[#FFF4B7]/10 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center inline-block">
                            {data.secondaryCta.text}
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
