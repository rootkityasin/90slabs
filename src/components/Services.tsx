'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Globe,
    Smartphone,
    Palette,
    Bot,
    Rocket,
    Code2,
    CircuitBoard,
    Brain,
    Monitor,
    ArrowRight,
    Layers,
    Sparkles,
    Cpu,
    LucideIcon
} from 'lucide-react'

import { Category, Service, ServicesData } from '@/lib/types'

export default function Services() {
    const container = useRef(null)
    const [data, setData] = useState<ServicesData | null>(null)
    const [loading, setLoading] = useState(true)

    const iconMap: Record<string, LucideIcon> = {
        Globe,
        Smartphone,
        Palette,
        Bot,
        Rocket,
        Code2,
        CircuitBoard,
        Brain,
        Monitor
    }

    const categoryIconMap: Record<string, LucideIcon> = {
        development: Layers,
        design: Sparkles,
        ai: Cpu
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/services')
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                }
            } catch (error) {
                console.error('Error fetching services:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <section id="services" className="py-20 md:py-32 relative bg-[#f5f5f0] overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
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

    const { categories } = data

    const renderCard = (service: Service, idx: number, prefix = '') => {
        const IconComponent = iconMap[service.icon] || Globe
        return (
            <div
                key={`${prefix}-${service.id}-${idx}`}
                className={`group relative overflow-hidden rounded-3xl border p-5 sm:p-6 h-full min-w-[78vw] sm:min-w-[280px] w-[78vw] sm:w-[320px] cursor-pointer transform transition-all duration-500 ease-out hover:z-50
                    ${service.featured
                        ? 'border-[#008f7d]/40 bg-white hover:border-[#008f7d]/60'
                        : 'border-[#008f7d]/20 bg-white/80 hover:border-[#008f7d]/40'
                    }
                    backdrop-blur-lg
                    hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,143,125,0.15)]`}
            >
                {service.featured && (
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-[#008f7d]/10 border border-[#008f7d]/30">
                        <span className="text-[10px] font-semibold text-[#008f7d] uppercase tracking-wider">Featured</span>
                    </div>
                )}

                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#008f7d]/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className={`mb-5 inline-flex p-3 rounded-2xl w-fit border origin-left shadow-[0_0_15px_rgba(0,143,125,0.1)]
                        ${service.featured
                            ? 'bg-[#FFF4B7]/10 border-[#FFF4B7]/30'
                            : 'bg-[#008f7d]/10 border-[#008f7d]/20'
                        }`}>
                        <IconComponent className={`w-7 h-7 ${service.featured ? 'text-[#008f7d]' : 'text-[#008f7d]'}`} strokeWidth={1.5} />
                    </div>

                    <h4 className="text-lg sm:text-xl font-semibold text-[#1a1a2e] mb-2 tracking-wide">{service.title}</h4>

                    <p className="text-[#4a5568] leading-relaxed text-sm font-normal mb-6 flex-grow">
                        {service.description}
                    </p>

                    <div className="flex items-center text-xs font-semibold tracking-wide text-[#008f7d]">
                        <span className="mr-2">LEARN MORE</span>
                        <div className="w-7 h-7 rounded-full bg-[#008f7d]/10 flex items-center justify-center">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="services" ref={container} className="py-20 md:py-32 relative bg-[#f5f5f0] overflow-visible">
            {/* Liquid Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#008f7d]/05 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#008f7d]/08 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#008f7d]/03 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 md:mb-6 text-[#1a1a2e] tracking-tight">
                        Our Expertise
                    </h2>
                    <p className="text-[#4a5568] text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                        Comprehensive solutions forged in liquid innovation.
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-14 md:space-y-20">
                    {categories.map((category, catIdx) => {
                        const CategoryIcon = categoryIconMap[category.id] || Layers

                        // Ensure short lists are repeated so marquee feels continuous
                        const servicesToShow = (() => {
                            const base = category.services || []
                            if (base.length === 0) return []
                            const MIN_SERVICES = 8
                            let arr = [...base]
                            while (arr.length < MIN_SERVICES) arr = arr.concat(base)
                            return arr
                        })()

                        return (
                            <div key={category.id} className="category-section overflow-visible">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8 pb-3 md:pb-4 border-b border-[#008f7d]/20">
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-[#008f7d]/30 to-[#008f7d]/10 border border-[#008f7d]/40 shadow-[0_0_20px_rgba(0,143,125,0.2)]">
                                        <CategoryIcon className="w-6 h-6 text-[#008f7d]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1a1a2e] tracking-wide">
                                            {category.title}
                                        </h3>
                                        <p className="text-[#4a5568] text-xs sm:text-sm mt-1">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Cards Grid */}
                                <div className="overflow-visible pt-4 pb-4 -mt-4 md:-mt-8">
                                    <div className="marquee-wrapper">
                                        <div className={`marquee-track ${catIdx % 2 === 1 ? 'marquee-reverse' : ''}`}>
                                            <div className="marquee-group flex mt-4 mb-4 gap-6">
                                                {servicesToShow.map((service, idx) => renderCard(service, idx, 'first'))}
                                            </div>

                                            <div className="marquee-group flex mt-4 mb-4 gap-6" aria-hidden="true">
                                                {servicesToShow.map((service, idx) => renderCard(service, idx, 'second'))}
                                            </div>
                                        </div>
                                        <style jsx>{`
                                            .marquee-wrapper { 
                                                overflow-x: hidden;
                                                overflow-y: visible;
                                                position: relative;
                                            }
                                            .marquee-track { 
                                                display: flex; 
                                                gap: 1.5rem; 
                                                align-items: stretch; 
                                                animation: marquee 28s linear infinite; 
                                                will-change: transform; 
                                            }
                                            .marquee-track .marquee-group { 
                                                display: flex; 
                                                gap: 1.5rem;
                                                position: relative;
                                            }
                                            .marquee-reverse { 
                                                animation-direction: reverse; 
                                            }
                                            .marquee-wrapper:hover .marquee-track { 
                                                animation-play-state: paused; 
                                            }
                                            @keyframes marquee { 
                                                from { transform: translateX(0); } 
                                                to { transform: translateX(-50%); } 
                                            }
                                            @media (max-width: 768px) {
                                                .marquee-wrapper {
                                                    overflow-x: auto;
                                                    scroll-snap-type: x mandatory;
                                                }
                                                .marquee-track {
                                                    animation: none;
                                                    width: max-content;
                                                }
                                                .marquee-track .marquee-group {
                                                    width: max-content;
                                                }
                                                .marquee-group > * {
                                                    scroll-snap-align: start;
                                                }
                                            }
                                        `}</style>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}