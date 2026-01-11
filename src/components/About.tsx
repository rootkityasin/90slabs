'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Lottie from 'lottie-react'
import glitchAnimation from '../../public/Glitch-Logo-Reveal-01.json'

interface AboutData {
    label: string
    title: string
    titleHighlight: string
    paragraphs: string[]
    graphicText: string
    graphicSubtext: string
}

export default function About() {
    const container = useRef(null)
    const [data, setData] = useState<AboutData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/about')
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                } else {
                    // Fallback to default content
                    setData({
                        label: "Who We Are",
                        title: "Digital",
                        titleHighlight: "Alchemists",
                        paragraphs: [
                            "At 90sX, we believe in the power of <span class=\"text-white font-medium\">nostalgia fused with futurism</span>. We don't just build websites; we construct digital realities that defy convention and elevate user experience to art.",
                            "Born from a passion for the 90s aesthetic and modern engineering, our team delivers software that is both robust and visually stunning."
                        ],
                        graphicText: "90sX",
                        graphicSubtext: "Agency"
                    })
                }
            } catch (error) {
                console.error('Error fetching about:', error)
                // Fallback to default content
                setData({
                    label: "Who We Are",
                    title: "Digital",
                    titleHighlight: "Alchemists",
                    paragraphs: [
                        "At 90sX, we believe in the power of <span class=\"text-white font-medium\">nostalgia fused with futurism</span>. We don't just build websites; we construct digital realities that defy convention and elevate user experience to art.",
                        "Born from a passion for the 90s aesthetic and modern engineering, our team delivers software that is both robust and visually stunning."
                    ],
                    graphicText: "90sX",
                    graphicSubtext: "Agency"
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <section id="about" className="py-32 relative bg-[#001210] overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        )
    }

    if (!data) {
        return null
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

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 20
            }
        }
    }

    const cardVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 60,
                damping: 20
            }
        }
    }

    return (
        <section id="about" ref={container} className="py-32 relative bg-[#001210] selection:bg-[#008f7d]/30 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Decorative line */}
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#FFF4B7]/20 to-transparent mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                    <motion.div
                        className="order-2 md:order-1"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.span
                            className="text-[#FFF4B7] font-mono text-sm tracking-widest uppercase mb-6 block drop-shadow-[0_0_10px_rgba(255,244,183,0.3)]"
                            variants={itemVariants}
                        >
                            {data.label}
                        </motion.span>
                        <motion.h2
                            className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-[0_0_15px_rgba(0,18,16,0.5)]"
                            variants={itemVariants}
                        >
                            {data.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFF4B7]">{data.titleHighlight}</span>
                        </motion.h2>

                        <motion.div
                            className="space-y-6 text-lg md:text-xl text-[#FFF4B7]/70 font-light leading-relaxed"
                            variants={itemVariants}
                        >
                            {data.paragraphs.map((paragraph, index) => (
                                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="order-1 md:order-2 relative group"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {/* Glass reflection container */}
                        <div className="about-glass-container">
                            {/* Soft ambient glow background */}
                            <div className="absolute -inset-6 bg-gradient-to-br from-[#008f7d]/20 to-[#008f7d]/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

                            {/* Main glass card */}
                            <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden about-glass-card flex items-center justify-center">
                                {/* Blurred mirror reflection of the content behind */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute inset-0 transform scale-125 blur-2xl opacity-30">
                                        <Lottie
                                            animationData={glitchAnimation}
                                            loop={true}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>

                                {/* Glass tint layer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#001210]/50 via-[#008f7d]/10 to-[#001210]/60"></div>

                                {/* Frosted glass effect */}
                                <div className="absolute inset-0 backdrop-blur-lg backdrop-saturate-150"></div>

                                {/* Glass noise texture */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>

                                {/* Top edge highlight - realistic glass refraction */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none"></div>

                                {/* Left edge highlight */}
                                <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent"></div>

                                {/* Main Lottie Animation */}
                                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                                    <Lottie
                                        animationData={glitchAnimation}
                                        loop={true}
                                        className="w-full h-full max-w-[400px] drop-shadow-[0_0_25px_rgba(0,143,125,0.3)]"
                                    />
                                </div>

                                {/* Bottom inner shadow */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#001210]/30 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Mirror reflection below */}
                            <div className="relative mt-1 h-20 overflow-hidden rounded-b-xl about-glass-reflection">
                                <div className="absolute inset-0 transform scale-x-100 -scale-y-100 origin-top blur-md opacity-25">
                                    <Lottie
                                        animationData={glitchAnimation}
                                        loop={true}
                                        className="w-full h-full"
                                    />
                                </div>
                                {/* Gradient fade for reflection */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001210]/80 to-[#001210]"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
