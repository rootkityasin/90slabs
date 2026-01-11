'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic import for ParticleCanvas to avoid SSR issues with Three.js
const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), {
    ssr: false,
    loading: () => null
})

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

// 3D Floating Shape Component
interface FloatingShapeProps {
    className?: string
    style?: React.CSSProperties
    mouseX: number
    mouseY: number
    depth: number // 1-5, higher = more movement
    children?: React.ReactNode
}

function FloatingShape({ className, style, mouseX, mouseY, depth, children }: FloatingShapeProps) {
    const moveX = (mouseX - 0.5) * depth * 40
    const moveY = (mouseY - 0.5) * depth * 40
    const rotateX = (mouseY - 0.5) * depth * 10
    const rotateY = (mouseX - 0.5) * depth * 10

    return (
        <motion.div
            className={className}
            style={{
                ...style,
                transform: `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.3s ease-out',
            }}
        >
            {children}
        </motion.div>
    )
}

export default function Hero() {
    const comp = useRef<HTMLElement | null>(null)
    const [data, setData] = useState<HeroData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

    // Wait for component to mount before using scroll
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Mouse tracking for parallax effect
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!comp.current) return
        const rect = comp.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePosition({ x, y })
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

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
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 bg-[#f5f5f0]">
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
                type: 'spring' as const,
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
                type: 'spring' as const,
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
                type: 'spring' as const,
                stiffness: 100,
                damping: 15,
                delay: 0.6 + i * 0.1
            }
        })
    }

    return (
        <section ref={comp} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 bg-[#f5f5f0] selection:bg-[#008f7d]/30 selection:text-[#008f7d]" style={{ perspective: '1000px' }}>
            {/* Subtle Aurora Background */}
            <div className="aurora-bg"></div>
            <div className="hero-vignette" aria-hidden></div>
            <div className="hero-noise" aria-hidden></div>

            {/* React Three Fiber Particle System */}
            <ParticleCanvas />

            <motion.div
                className="container px-4 md:px-6 relative z-10 flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-5xl md:text-8xl lg:text-[7rem] font-semibold tracking-tight mb-8 text-center leading-[1] max-w-5xl mx-auto"
                    style={isMounted ? { y: bgTextY, scale: bgTextScale, rotate: bgTextRotate } : undefined}
                >
                    <div className="overflow-hidden">
                        <motion.span
                            className="block text-[#1a1a2e] pb-4"
                            variants={textVariants}
                        >
                            {data.headline1}
                        </motion.span>
                    </div>
                    <div className="overflow-hidden">
                        <motion.span
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#008f7d] to-[#006b5c] pb-4"
                            variants={textVariants}
                            style={isMounted ? { y: fgTextY, scale: fgTextScale, rotate: fgTextRotate } : undefined}
                        >
                            {data.headline2}
                        </motion.span>
                    </div>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-3xl text-[#4a5568] max-w-2xl mx-auto mb-14 leading-relaxed text-center font-normal tracking-wide"
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
                        <Link href={data.primaryCta.href} className="group relative px-8 py-4 bg-gradient-to-r from-[#008f7d] to-[#007a6b] text-white text-sm font-bold rounded-full overflow-hidden hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center shadow-[0_4px_20px_rgba(0,143,125,0.4)] hover:shadow-[0_8px_30px_rgba(0,143,125,0.5)] inline-block">
                            <span className="relative z-10">{data.primaryCta.text}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#007a6b] to-[#008f7d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </motion.div>
                    <motion.div variants={buttonVariants} custom={1}>
                        <Link href={data.secondaryCta.href} className="group px-8 py-4 glass text-[#1a1a2e] text-sm font-medium rounded-full hover:bg-[#008f7d]/10 border border-[#008f7d]/25 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto text-center inline-block hover:border-[#008f7d]/40">
                            {data.secondaryCta.text}
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
