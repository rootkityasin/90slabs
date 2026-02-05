'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { LogoCloud } from "@/components/ui/logo-cloud-3"

export default function HeroAbout() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const [heroImages, setHeroImages] = useState<string[]>([])
    const [aboutContent, setAboutContent] = useState({
        title: "Bridging the gap between vision and reality",
        titleHighlight: "vision and reality",
        paragraphs: [
            "We are a team of passionate developers, designers, and strategists dedicated to building the next generation of digital products. Our focus is on delivering clean, scalable, and high-performance solutions.",
            "With our advanced dashboarding tools and AI-integrated workflows, we help startups and enterprises alike launch faster and scale smarter."
        ],
        partnerLogos: [] as Array<string | { src?: string; alt?: string }>,
        graphicText: "About Us"
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const [nextIndex, setNextIndex] = useState(1)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Fetch images and content from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/about')
                if (res.ok) {
                    const data = await res.json()

                    // Set Images
                    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                        setHeroImages(data.images)
                        if (data.images.length > 1) {
                            setNextIndex(1)
                        }
                    }

                    // Set About Content
                    setAboutContent({
                        title: data.title || "Bridging the gap between vision and reality",
                        titleHighlight: data.titleHighlight || "vision and reality",
                        paragraphs: (data.paragraphs && data.paragraphs.length > 0)
                            ? data.paragraphs
                            : [
                                "We are a team of passionate developers, designers, and strategists dedicated to building the next generation of digital products. Our focus is on delivering clean, scalable, and high-performance solutions.",
                                "With our advanced dashboarding tools and AI-integrated workflows, we help startups and enterprises alike launch faster and scale smarter."
                            ],
                        partnerLogos: data.partnerLogos || [],
                        graphicText: data.graphicText || "About Us"
                    })
                }
            } catch (error) {
                console.error('Failed to fetch hero/about data:', error)
            }
        }
        fetchData()
    }, [])

    // Improved Carousel Timer with smoother transitions
    useEffect(() => {
        if (heroImages.length <= 1) return

        const timer = setInterval(() => {
            setIsTransitioning(true)

            // Pre-load next image
            const img = new window.Image()
            img.src = heroImages[(currentIndex + 1) % heroImages.length]

            // Smooth transition
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % heroImages.length)
                setNextIndex((currentIndex + 2) % heroImages.length)
                setIsTransitioning(false)
            }, 500) // Half second for transition
        }, 10000) // 10 seconds

        return () => clearInterval(timer)
    }, [heroImages, currentIndex])

    // Animation Transforms for Image
    const imageX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-45vw"])
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1])
    const imageRotateX = useTransform(scrollYProgress, [0, 0.5], ["0deg", "1deg"])
    const imageRotateY = useTransform(scrollYProgress, [0, 0.5], ["0deg", "2deg"])
    const imageY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-25%"]) // Moved up per user request

    // Opacity for sections
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
    const aboutOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])

    // Hero text movement
    const heroTextX = useTransform(scrollYProgress, [0, 0.3], ["0%", "-15%"])
    const heroTextOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

    // About card movement and effects
    const aboutCardX = useTransform(scrollYProgress, [0.3, 0.6], ["30px", "0px"])
    const aboutCardY = useTransform(scrollYProgress, [0.3, 0.6], ["15px", "0px"])
    const aboutCardScale = useTransform(scrollYProgress, [0.3, 0.6], [0.98, 1])

    const currentImage = heroImages.length > 0 ? heroImages[currentIndex] : "/saas-dashboard.png"
    const upcomingImage = heroImages.length > 1 ? heroImages[nextIndex] : ""

    // Normalize partner logos from API (strings or objects) and drop invalid entries.
    const formattedLogos = (aboutContent.partnerLogos || [])
        .map((logo, idx) => {
            if (typeof logo === 'string') {
                const src = logo.trim()
                if (!src) return null
                return { src, alt: `Partner Logo ${idx + 1}` }
            }

            if (logo && typeof logo === 'object' && 'src' in logo) {
                const src = String((logo as { src?: string }).src || '').trim()
                if (!src) return null
                const alt = typeof (logo as { alt?: string }).alt === 'string'
                    ? (logo as { alt?: string }).alt!.trim() || `Partner Logo ${idx + 1}`
                    : `Partner Logo ${idx + 1}`
                return { src, alt }
            }

            return null
        })
        .filter(Boolean) as Array<{ src: string; alt: string }>

    // Add default logos if none are provided
    const defaultLogos = [
        {
            src: "https://svgl.app/library/nvidia-wordmark-light.svg",
            alt: "Nvidia Logo",
        },
        {
            src: "https://svgl.app/library/supabase_wordmark_light.svg",
            alt: "Supabase Logo",
        },
        {
            src: "https://svgl.app/library/openai_wordmark_light.svg",
            alt: "OpenAI Logo",
        },
        {
            src: "https://svgl.app/library/turso-wordmark-light.svg",
            alt: "Turso Logo",
        },
        {
            src: "https://svgl.app/library/vercel_wordmark.svg",
            alt: "Vercel Logo",
        },
        {
            src: "https://svgl.app/library/github_wordmark_light.svg",
            alt: "GitHub Logo",
        },
    ]

    const displayLogos = (() => {
        const base = formattedLogos.length > 0 ? formattedLogos : defaultLogos
        const MIN_LOGOS = 6
        if (base.length >= MIN_LOGOS) return base
        const repeated = [...base]
        while (repeated.length < MIN_LOGOS) repeated.push(...base)
        return repeated
    })()

    return (
        <section id="about" ref={containerRef} className="relative h-[200vh] bg-gradient-to-b from-gray-50 to-white">
            {/* Background Effects - SIMPLIFIED VERSION */}
            <div
                aria-hidden="true"
                className={cn(
                    "-z-10 top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin]",
                    "bg-gradient-to-br from-[#008f7d]/5 to-transparent rounded-full",
                    "blur-[30px]"
                )}
            />

            {/* Sticky Container for the Image */}
            <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-10">
                <div className="absolute inset-0">
                    <div className="container mx-auto h-full flex items-center">
                        {/* Image positioned on right for Hero, moving to left for About */}
                        <div className="w-full h-full flex justify-end items-center pr-0 md:pr-4">
                            <motion.div
                                style={{
                                    x: imageX,
                                    y: imageY,
                                    scale: imageScale,
                                    rotateX: imageRotateX,
                                    rotateY: imageRotateY,
                                }}
                                className="relative w-[55vw] md:w-[45vw] h-[35vh] md:h-[50vh] rounded-3xl overflow-hidden shadow-2xl shadow-[#008f7d]/20"
                            >
                                {/* Current Image with smooth transition */}
                                <motion.div
                                    key={`current-${currentIndex}`}
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: isTransitioning ? 0 : 1 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={currentImage}
                                        alt="SaaS Dashboard Preview"
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 55vw, 45vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />
                                </motion.div>

                                {/* Next Image pre-loaded for smoother transition */}
                                {heroImages.length > 1 && (
                                    <motion.div
                                        key={`next-${nextIndex}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: isTransitioning ? 1 : 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <Image
                                            src={upcomingImage}
                                            alt="Next Preview"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 55vw, 45vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HERO CONTENT SECTION (First 100vh) */}
            <motion.div
                style={{ opacity: heroTextOpacity, x: heroTextX }}
                className="absolute top-0 w-full h-screen flex items-center z-20 pointer-events-none"
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="pointer-events-auto"
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900"
                            >
                                <span className="block">Create SaaS</span>
                                <span className="block bg-gradient-to-r from-[#008f7d] to-[#00a38b] bg-clip-text text-transparent">
                                    Faster Than Ever
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed"
                            >
                                Accelerate product development through flexible, production-ready SaaS architecture enhanced by AI.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Link
                                    href="#contact"
                                    className="px-8 py-4 bg-gradient-to-r from-[#008f7d] to-[#00a38b] text-white rounded-full text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Start a Project</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#00a38b] to-[#008f7d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    href="#work"
                                    className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full text-base md:text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-gray-300"
                                >
                                    View Our Work
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* ABOUT CONTENT SECTION */}
            <div className="absolute top-[100vh] w-full h-screen flex items-center z-30">
                <div className="container mx-auto px-4 md:px-8">
                    <section className="relative mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left side - Image placeholder and Logo Cloud */}
                            <div className="lg:flex flex-col gap-8">
                                {/* This div reserves space for the sticky image */}
                                <div className="w-full h-[35vh] md:h-[50vh]" />

                                {/* Logo Cloud Section */}
                                <div className="w-full">
                                    <h2 className="mb-5 text-center font-medium text-gray-700 text-lg md:text-xl tracking-tight">
                                        <span className="text-gray-500">Trusted by experts.</span>
                                        <br />
                                        <span className="font-semibold text-gray-900">Used by the leaders.</span>
                                    </h2>
                                    <div className="relative">
                                        <LogoCloud logos={displayLogos} className="py-4" />

                                        {/* Custom styling for auto-scroll effect */}
                                        <style jsx>{`
                                            /* Force horizontal scroll for logos */
                                            .logo-scroll-container {
                                                overflow-x: auto;
                                                overflow-y: hidden;
                                                scroll-behavior: smooth;
                                                scrollbar-width: none;
                                                -ms-overflow-style: none;
                                            }
                                            .logo-scroll-container::-webkit-scrollbar {
                                                display: none;
                                            }
                                            
                                            /* Auto-scroll animation */
                                            @keyframes scrollHorizontal {
                                                0% {
                                                    transform: translateX(0);
                                                }
                                                100% {
                                                    transform: translateX(-50%);
                                                }
                                            }
                                            
                                            .logo-grid {
                                                display: flex;
                                                animation: scrollHorizontal 5s linear infinite;
                                            }
                                            
                                            .logo-grid:hover {
                                                animation-play-state: paused;
                                            }
                                        `}</style>
                                    </div>

                                    <div className="mt-4">{/* Spacer */}</div>
                                </div>
                            </div>

                            {/* Right side - About Card */}
                            <motion.div
                                style={{
                                    opacity: aboutOpacity,
                                    x: aboutCardX,
                                    y: aboutCardY,
                                    scale: aboutCardScale
                                }}
                                className="relative"
                            >
                                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#008f7d]/10 border border-gray-100 relative overflow-hidden group">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-[#008f7d]/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#008f7d] to-[#00a38b]" />

                                    <div className="relative z-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <span className="inline-block px-4 py-2 bg-[#008f7d]/10 rounded-full text-sm font-bold uppercase tracking-widest text-[#008f7d] mb-6">
                                                {aboutContent.graphicText}
                                            </span>

                                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                                {aboutContent.title.replace(aboutContent.titleHighlight, "")}
                                                <span className="text-gray-400">{aboutContent.titleHighlight}</span>
                                            </h2>

                                            <div className="space-y-6">
                                                {aboutContent.paragraphs.map((para, idx) => (
                                                    <p key={idx} className="text-lg text-gray-600 leading-relaxed">
                                                        {para}
                                                    </p>
                                                ))}

                                                <div className="pt-4">
                                                    <ul className="grid grid-cols-2 gap-4">
                                                        <li className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 rounded-full bg-[#008f7d]" />
                                                            <span className="text-gray-700">Scalable Architecture</span>
                                                        </li>
                                                        <li className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 rounded-full bg-[#008f7d]" />
                                                            <span className="text-gray-700">AI Integration</span>
                                                        </li>
                                                        <li className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 rounded-full bg-[#008f7d]" />
                                                            <span className="text-gray-700">Real-time Analytics</span>
                                                        </li>
                                                        <li className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 rounded-full bg-[#008f7d]" />
                                                            <span className="text-gray-700">Security Focused</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="pt-6">
                                                    <Link
                                                        href="#about"
                                                        className="inline-flex items-center space-x-2 text-[#008f7d] font-semibold hover:text-[#006b5c] transition-colors duration-300"
                                                    >
                                                        <span>Learn more about our approach</span>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#008f7d]/30 rounded-tr-3xl" />
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
            >
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">Scroll</span>
                    <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    )
}