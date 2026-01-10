'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

    useEffect(() => {
        if (!data || loading) return

        const ctx = gsap.context(() => {
            gsap.from('.about-text', {
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
            })
        }, container)

        return () => ctx.revert()
    }, [data, loading])

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

    return (
        <section id="about" ref={container} className="py-32 relative bg-[#001210] selection:bg-[#008f7d]/30 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Decorative line */}
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#FFF4B7]/20 to-transparent mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="order-2 md:order-1">
                        <span className="about-text text-[#FFF4B7] font-mono text-sm tracking-widest uppercase mb-6 block drop-shadow-[0_0_10px_rgba(255,244,183,0.3)]">{data.label}</span>
                        <h2 className="about-text text-5xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-[0_0_15px_rgba(0,18,16,0.5)]">
                            {data.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFF4B7]">{data.titleHighlight}</span>
                        </h2>

                        <div className="about-text space-y-6 text-lg md:text-xl text-[#FFF4B7]/70 font-light leading-relaxed">
                            {data.paragraphs.map((paragraph, index) => (
                                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                            ))}
                        </div>
                    </div>

                    <div className="about-text order-1 md:order-2 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#008f7d] to-[#008f7d] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden glass-card flex items-center justify-center border border-[#008f7d]/30 group-hover:border-[#FFF4B7]/40 transition-colors duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#001210]/80 to-[#008f7d]/50 mix-blend-overlay"></div>

                            {/* Animated 90sX Line Drawing */}
                            <div className="text-center relative z-10 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 280 80"
                                    className="w-full max-w-[400px] h-auto"
                                    style={{ filter: 'drop-shadow(0 0 20px rgba(0, 143, 125, 0.5))' }}
                                >
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#FFF4B7" />
                                            <stop offset="50%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#008f7d" />
                                        </linearGradient>
                                    </defs>
                                    {/* 9 */}
                                    <path
                                        d="M10 25 Q10 10 25 10 Q40 10 40 25 Q40 40 25 40 L40 40 L40 70"
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-[draw_2s_ease-out_forwards]"
                                        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                                    />
                                    {/* 0 */}
                                    <ellipse
                                        cx="75" cy="40" rx="20" ry="30"
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="animate-[draw_2s_ease-out_0.3s_forwards]"
                                        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                                    />
                                    {/* s */}
                                    <path
                                        d="M130 25 Q110 25 110 35 Q110 45 130 45 Q150 45 150 55 Q150 65 130 65"
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-[draw_2s_ease-out_0.6s_forwards]"
                                        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                                    />
                                    {/* X */}
                                    <path
                                        d="M175 10 L215 70 M215 10 L175 70"
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-[draw_2s_ease-out_0.9s_forwards]"
                                        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                                    />

                                    {/* Glow effect text behind */}
                                    <text
                                        x="120" y="55"
                                        textAnchor="middle"
                                        className="text-6xl font-black fill-[#008f7d]/20 blur-sm animate-pulse"
                                        style={{ filter: 'blur(8px)' }}
                                    >
                                        90sX
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
