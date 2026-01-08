'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
    const container = useRef(null)

    useEffect(() => {
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
    }, [])

    return (
        <section id="about" ref={container} className="py-32 relative bg-[#001210] selection:bg-[#008f7d]/30 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Decorative line */}
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#FFF4B7]/20 to-transparent mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div className="order-2 md:order-1">
                        <span className="about-text text-[#FFF4B7] font-mono text-sm tracking-widest uppercase mb-6 block drop-shadow-[0_0_10px_rgba(255,244,183,0.3)]">Who We Are</span>
                        <h2 className="about-text text-5xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-[0_0_15px_rgba(0,18,16,0.5)]">
                            Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFF4B7]">Alchemists</span>
                        </h2>

                        <div className="about-text space-y-6 text-lg md:text-xl text-[#FFF4B7]/70 font-light leading-relaxed">
                            <p>
                                At 90sX, we believe in the power of <span className="text-white font-medium">nostalgia fused with futurism</span>. We don't just build websites; we construct digital realities that defy convention and elevate user experience to art.
                            </p>
                            <p>
                                Born from a passion for the 90s aesthetic and modern engineering, our team delivers software that is both robust and visually stunning.
                            </p>
                        </div>
                    </div>

                    <div className="about-text order-1 md:order-2 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#008f7d] to-[#008f7d] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden glass-card flex items-center justify-center border border-[#008f7d]/30 group-hover:border-[#FFF4B7]/40 transition-colors duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#001210]/80 to-[#008f7d]/50 mix-blend-overlay"></div>

                            {/* Graphic / Typography Art */}
                            <div className="text-center relative z-10 mix-blend-difference">
                                <div className="text-8xl md:text-[10rem] font-black text-white tracking-tighter opacity-10 select-none">90sX</div>
                                <div className="text-xl md:text-3xl font-bold text-[#FFF4B7] tracking-[1em] uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center drop-shadow-[0_0_10px_rgba(255,244,183,0.2)]">Agency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
