'use client'

import { useRef, useState, useEffect, useLayoutEffect, FormEvent } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import Link from 'next/link'

// --- Interfaces (Combined from Hero and About) ---

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

interface AboutData {
    images: any
    partnerLogos?: string[]
    label: string
    title: string
    titleHighlight: string
    paragraphs: string[]
    graphicText: string
    graphicSubtext: string
}

export default function HeroAbout() {
    // Refs
    const containerRef = useRef<HTMLElement>(null)
    const [heroData, setHeroData] = useState<HeroData | null>(null)
    const [aboutData, setAboutData] = useState<AboutData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [hasRef, setHasRef] = useState(false)

    // Data Fetching
    useEffect(() => {
        async function fetchAllData() {
            try {
                const [heroRes, aboutRes] = await Promise.all([
                    fetch('/api/hero'),
                    fetch('/api/about')
                ])

                if (heroRes.ok) setHeroData(await heroRes.json())
                else {
                    setHeroData({
                         headline1: "Precision in",
                        headline2: "Every Pixel.",
                        description: "We craft digital experiences that feel inevitable. Simple. Powerful. Timeless.",
                        primaryCta: { text: "Start a Project", href: "#contact" },
                        secondaryCta: { text: "View Our Work", href: "#projects" }
                    })
                }

                if (aboutRes.ok) setAboutData(await aboutRes.json())
                else {
                    setAboutData({
                        images: [],
                        label: "Who We Are",
                        title: "Digital",
                        titleHighlight: "Alchemists",
                        paragraphs: [
                            "At 90sX, we believe in the power of <span class=\"text-white font-medium\">nostalgia fused with futurism</span>.",
                            "Born from a passion for the 90s aesthetic and modern engineering."
                        ],
                        graphicText: "90sX",
                        graphicSubtext: "Agency",
                        partnerLogos: []
                    })
                }
            } catch (error) {
                console.error("Error fetching data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllData()
    }, [])

    // Ensure the DOM ref has been attached before passing it to `useScroll`.
    useLayoutEffect(() => {
        if (containerRef.current && !hasRef) {
            setHasRef(true)
        }
    }, [hasRef])

    // Mark mounted on first client render (stable)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    

    // Scroll Hooks
    // Only pass the target once the component is mounted and the ref
    // has actually been hydrated on the DOM node.
    const { scrollYProgress } = useScroll({
        target: isMounted && hasRef ? containerRef : undefined,
        offset: ["start start", "end end"]
    })

    // Provide a safe fallback for the spring while `scrollYProgress`
    // may be undefined on the very first render.
    const smoothProgress = useSpring(scrollYProgress ?? 0, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // --- Animations ---
    
    // 1. Hero Content (Fades out and moves up as we scroll)
    const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0])
    const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 0.9])
    const heroY = useTransform(smoothProgress, [0, 0.3], [0, -100])

    // 2. The Shared Window (Central Element)
    // Starts small/medium in Hero, Expands/Transforms for About
    const windowWidth = useTransform(smoothProgress, [0, 0.15, 0.45], ["95%", "90%", "100%"])
    const windowHeight = useTransform(smoothProgress, [0, 0.15, 0.45], ["410px", "460px", "620px"])
    const windowY = useTransform(smoothProgress, [0, 0.2, 0.5], ["0%", "10%", "0%"])
    const windowRotateX = useTransform(smoothProgress, [0, 0.3], [10, 0])
    // const windowTop = useTransform(smoothProgress, [0, 0.5], ["20%", "50%"]) // Adjust positioning

    // 3. About Content (Fades in as we scroll)
    const aboutOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1])
    const aboutY = useTransform(smoothProgress, [0.4, 0.6], [50, 0])

    // Graphic opacity (avoid calling hooks inside JSX)
    const graphicOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1])
    const logosOpacity = useTransform(smoothProgress, [0.05, 0.15], [1, 1])
    const [currentIndex, setCurrentIndex] = useState(0)
    // marquee refs and state for seamless infinite scrolling
    const marqueeRef = useRef<HTMLDivElement | null>(null)
    const marqueeInnerRef = useRef<HTMLDivElement | null>(null)
    const [marqueeRange, setMarqueeRange] = useState<[string, string] | null>(null)
    const [marqueeDuration, setMarqueeDuration] = useState<number>(35)
    const [isChatOpen, setIsChatOpen] = useState(false)

    // Horizontal shift for right-to-left screen movement as user scrolls
    const horizontalShift = useTransform(smoothProgress, [0, 0.45], ["0%", "-30%"])
    // Slide-in offset for the about card on the right
    const aboutX = useTransform(smoothProgress, [0.4, 0.6], ["40px", "0px"]) 

    useEffect(() => {
        if (!aboutData || !aboutData.images || aboutData.images.length <= 1) {
            setCurrentIndex(0)
            return
        }
        const id = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % aboutData.images!.length)
        }, 10000)
        return () => clearInterval(id)
    }, [aboutData])

    // Measure marquee inner width and set translate range for seamless loop
    useEffect(() => {
        function updateMarquee() {
            const inner = marqueeInnerRef.current
            if (!inner) return
            const total = inner.scrollWidth
            // We duplicate the items exactly once, so half the inner width
            const half = Math.round(total / 2)
            if (half > 0) {
                setMarqueeRange([`0px`, `-${half}px`])
                // Make duration proportional to width so speed feels consistent
                setMarqueeDuration(Math.max(20, Math.round(half / 120)))
            }
        }
        // Defer measurement to next paint
        const raf = requestAnimationFrame(updateMarquee)
        window.addEventListener('resize', updateMarquee)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', updateMarquee)
        }
    }, [aboutData])


    // Do not block render - prefer non-blocking loading overlay

    // Safely access data or defaults
    const hData: HeroData = heroData ?? {
        headline1: 'Precision in',
        headline2: 'Every Pixel.',
        description: 'We craft digital experiences that feel inevitable. Simple. Powerful. Timeless.',
        primaryCta: { text: 'Start a Project', href: '#contact' },
        secondaryCta: { text: 'View Our Work', href: '#projects' }
    }

    const aData: AboutData = aboutData ?? {
        images: [],
        label: 'Who We Are',
        title: 'Digital',
        titleHighlight: 'Alchemists',
        paragraphs: [
            'At 90sX, we believe in the power of <span class="text-white font-medium">nostalgia fused with futurism</span>.',
            'Born from a passion for the 90s aesthetic and modern engineering.'
        ],
        graphicText: '90sX',
        graphicSubtext: 'Agency',
        partnerLogos: []
    }
    const partnerLogos = (aData.partnerLogos || []).filter((logo) => !!logo).slice(0, 12)
    // Duplicate once for a seamless two-set marquee
    const marqueeLogos = partnerLogos.length > 0 ? [...partnerLogos, ...partnerLogos] : []
    const [chatMessage, setChatMessage] = useState('')
    const toggleChat = () => setIsChatOpen((prev) => !prev)
    const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!chatMessage.trim()) return
        setChatMessage('')
    }

    return (
        <section ref={containerRef} className="relative h-[250vh] bg-transparent text-white">
            
            {/* Sticky Container - The Viewport */}
                <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-start pt-8 perspective-[1000px]">
                
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />
                
                {/* HERO + DISPLAY LAYOUT - left column text/buttons, right column display */}
                <motion.div style={{ x: horizontalShift }} className="absolute inset-0 z-10 pointer-events-none">
                    <div className="h-full w-full flex items-start pt-30">
                        <div className="container mx-auto px-6 w-full max-w-screen-xl grid md:grid-cols-[0.65fr_1.5fr] items-start justify-between">
                            <motion.div
                                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                                className="flex flex-col items-start justify-center pt-3 pointer-events-auto max-w-md"
                            >
                                <h1 className="text-4xl md:text-6xl font-semibold md:font-bold tracking-tight mb-4 leading-tight text-left">
                                    <span className="text-[#0b1220]">{hData.headline1}</span>{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008f7d] to-[#006b5c]">{hData.headline2}</span>
                                </h1>
                                <p className="text-gray-500 text-base md:text-lg max-w-lg text-left mb-6 font-medium">
                                    {hData.description}
                                </p>
                                <div className="flex gap-4">
                                    <Link href={hData.primaryCta.href} className="px-6 py-3 bg-[#006b5c] hover:bg-[#005a50] text-white rounded-full transition-transform transform duration-200 ease-out hover:-translate-y-1 active:translate-y-0.5 shadow-sm hover:shadow-md text-sm font-medium pointer-events-auto">
                                        {hData.primaryCta.text}
                                    </Link>
                                    <Link href={hData.secondaryCta.href} className="px-6 py-3 border border-[#006b5c] text-[#006b5c] rounded-full transition-transform duration-200 ease-out hover:bg-[#006b5c] hover:text-white hover:shadow-md text-sm font-medium pointer-events-auto">
                                        {hData.secondaryCta.text}
                                    </Link>
                                </div>
                            </motion.div>

                            <div className="flex w-full justify-end pr-4">
                                <motion.div
                                    style={{ width: windowWidth, height: windowHeight, y: windowY, rotateX: windowRotateX, aspectRatio: '16/9' }}
                                    className="relative z-0 rounded-2xl overflow-hidden shadow-2xl w-full pointer-events-none"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                    {aData.images && aData.images.length > 0 ? (
                                        <div className="relative w-full h-full">
                                            {(aData.images as string[]).map((src: string, i: number) => (
                                                <motion.img
                                                    key={src + i}
                                                    src={src}
                                                    alt={`hero-${i}`}
                                                    className="absolute inset-0 object-cover w-full h-full"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: i === currentIndex ? 1 : 0 }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center z-10">
                                            <motion.h3 className="text-7xl font-bold text-white/5 opacity-50" style={{ opacity: graphicOpacity }}>
                                                {aData.graphicText}
                                            </motion.h3>
                                        </div>
                                    )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Partner logos marquee disabled
                    To re-enable, restore the `marqueeLogos` block here.
                */}

                {/* ABOUT SECTION OVERLAY - slides in on the right */}
                <motion.div
                    style={{ opacity: aboutOpacity, y: aboutY }}
                    className="absolute pointer-events-none inset-0 flex items-center justify-end z-20"
                >
                    <div className="container mx-auto px-6 w-full max-w-5xl flex justify-end">
                        <motion.div style={{ x: aboutX }} className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 pointer-events-auto max-w-md shadow-xl ring-1 ring-black/5">
                            <span className="text-[#0b1220] text-sm md:text-base uppercase tracking-widest font-semibold mb-4 block">
                                {aData.label}
                            </span>
                            <h2 className="text-3xl font-bold mb-4 text-[#0b1220]">
                                {aData.title} <span className="text-[#008f7d]">{aData.titleHighlight}</span>
                            </h2>
                            <div className="space-y-4 text-[#0b1220] text-sm leading-relaxed">
                                {aData.paragraphs.map((p, i) => (
                                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>

            <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">
                <motion.div
                    animate={isChatOpen ? { scale: 1.03 } : { scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.2, repeat: isChatOpen ? 0 : Infinity, ease: 'easeInOut' }}
                >
                    <button
                        onClick={toggleChat}
                        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
                        className="pointer-events-auto rounded-full bg-gradient-to-tr from-[#00a08d] to-[#008f7d] p-4 shadow-2xl shadow-[#00342e]/60 text-white flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 3C7 3 3 6.75 3 11.25c0 2.61 1.32 5 3.4 6.67L6 21l3.42-2c.88.24 1.82.37 2.58.37 5 0 9-3.75 9-8.25S17 3 12 3z"/>
                        </svg>
                    </button>
                </motion.div>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="pointer-events-auto w-72 max-w-sm bg-white/90 text-[#0b1220] rounded-2xl shadow-2xl border border-[#0b1220]/5 backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0b1220]/10">
                            <div>
                                <p className="text-sm font-semibold">Need help?</p>
                                <p className="text-xs text-[#0b1220]/60">We usually reply within minutes</p>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="text-[#0b1220]/70 hover:text-[#0b1220]"
                                aria-label="Close chat box"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-3 space-y-2 text-sm text-[#0b1220]/70">
                            <p>Hello there 👋</p>
                            <p>Drop your message and someone from our team will get back shortly.</p>
                        </div>
                        <form onSubmit={handleChatSubmit} className="flex flex-col gap-2 px-4 pb-4">
                            <textarea
                                value={chatMessage}
                                onChange={(event) => setChatMessage(event.target.value)}
                                placeholder="Type your question…"
                                className="w-full h-20 resize-none rounded-xl border border-[#0b1220]/10 bg-[#001210]/5 px-3 py-2 text-sm text-[#0b1220] focus:outline-none focus:border-[#0b1220]"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-[#0b1220] text-white py-2 text-sm font-semibold hover:bg-[#0b1220]/90 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
