'use client'

import servicesData from '@/data/services.json'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
    Cpu
} from 'lucide-react'

interface Service {
    id: number
    title: string
    description: string
    icon: string
    featured?: boolean
}

interface Category {
    id: string
    title: string
    description: string
    services: Service[]
}

export default function Services() {
    const container = useRef(null)

    const iconMap: { [key: string]: any } = {
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

    const categoryIconMap: { [key: string]: any } = {
        development: Layers,
        design: Sparkles,
        ai: Cpu
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate category headers
            gsap.set('.category-header', { y: 30, opacity: 0 })
            gsap.set('.service-card', { y: 50, opacity: 0 })

            ScrollTrigger.batch('.category-header', {
                start: 'top 85%',
                onEnter: (elements) => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: "power2.out",
                        overwrite: true,
                    })
                },
                once: true
            })

            ScrollTrigger.batch('.service-card', {
                start: 'top 90%',
                onEnter: (elements) => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        overwrite: true,
                    })
                },
                once: true
            })

            ScrollTrigger.refresh()
        }, container)
        return () => ctx.revert()
    }, [])

    const { categories } = servicesData as { categories: Category[] }

    return (
        <section id="services" ref={container} className="py-32 relative bg-[#001210] overflow-hidden">
            {/* Liquid Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#008f7d]/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#008f7d]/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#008f7d]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,244,183,0.1)]">
                        Our Expertise
                    </h2>
                    <p className="text-[#FFF4B7]/80 text-xl font-normal leading-relaxed">
                        Comprehensive solutions forged in liquid innovation.
                    </p>
                </div>

                {/* Categories */}
                <div className="space-y-20">
                    {categories.map((category) => {
                        const CategoryIcon = categoryIconMap[category.id] || Layers

                        return (
                            <div key={category.id} className="category-section">
                                {/* Category Header */}
                                <div className="category-header flex items-center gap-4 mb-8 pb-4 border-b border-[#008f7d]/30">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#008f7d]/30 to-[#008f7d]/10 border border-[#008f7d]/40 shadow-[0_0_20px_rgba(0,143,125,0.2)]">
                                        <CategoryIcon className="w-6 h-6 text-[#FFF4B7]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide">
                                            {category.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {category.services.map((service) => {
                                        const IconComponent = iconMap[service.icon] || Globe

                                        return (
                                            <div
                                                key={service.id}
                                                className={`service-card group relative overflow-hidden rounded-3xl border p-6 h-full transition-transform duration-300 hover:-translate-y-2 cursor-pointer
                                                    ${service.featured
                                                        ? 'border-[#FFF4B7]/40 bg-gradient-to-br from-[#008f7d]/30 to-[#008f7d]/10 hover:border-[#FFF4B7]/60 hover:shadow-[0_0_40px_rgba(255,244,183,0.15)] md:col-span-2 lg:col-span-1'
                                                        : 'border-[#008f7d]/50 bg-[#008f7d]/20 hover:border-[#FFF4B7]/40 hover:shadow-[0_0_30px_rgba(0,143,125,0.3)]'
                                                    }
                                                    backdrop-blur-lg`}
                                                style={{ contain: 'layout style' }}
                                            >
                                                {/* Featured Badge */}
                                                {service.featured && (
                                                    <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-[#FFF4B7]/10 border border-[#FFF4B7]/30">
                                                        <span className="text-[10px] font-semibold text-[#FFF4B7] uppercase tracking-wider">Featured</span>
                                                    </div>
                                                )}

                                                {/* Liquid Hover Blob */}
                                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#008f7d]/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className={`mb-5 inline-flex p-3 rounded-2xl w-fit border transition-all duration-300 origin-left shadow-[0_0_15px_rgba(0,143,125,0.1)]
                                                        ${service.featured
                                                            ? 'bg-[#FFF4B7]/10 border-[#FFF4B7]/30 group-hover:bg-[#FFF4B7]/20'
                                                            : 'bg-[#008f7d]/10 border-[#008f7d]/20 group-hover:bg-[#008f7d]/20 group-hover:border-[#FFF4B7]/30 group-hover:scale-110'
                                                        }`}>
                                                        <IconComponent className={`w-7 h-7 transition-colors ${service.featured ? 'text-[#FFF4B7]' : 'text-[#FFF4B7] group-hover:text-white'}`} strokeWidth={1.5} />
                                                    </div>

                                                    <h4 className="text-xl font-semibold text-white mb-2 tracking-wide">{service.title}</h4>

                                                    <p className="text-gray-300 leading-relaxed text-sm font-normal mb-6 flex-grow group-hover:text-white/90 transition-colors">
                                                        {service.description}
                                                    </p>

                                                    <div className="flex items-center text-xs font-semibold tracking-wide text-[#FFF4B7] group-hover:text-white transition-colors">
                                                        <span className="mr-2">LEARN MORE</span>
                                                        <div className="w-7 h-7 rounded-full bg-[#FFF4B7]/10 flex items-center justify-center group-hover:bg-[#FFF4B7] group-hover:text-[#001210] transition-all duration-300">
                                                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:-rotate-45 transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
