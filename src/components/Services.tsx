'use client'

import servicesData from '@/data/services.json'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Services() {
    const container = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.service-card', {
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top 75%',
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
            })
        }, container)
        return () => ctx.revert()
    }, [])

    return (
        <section id="services" ref={container} className="py-32 relative bg-black">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white tracking-tight">
                        Expertise
                    </h2>
                    <p className="text-gray-400 text-xl font-normal leading-relaxed">
                        We build the tools that power tomorrow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {servicesData.map((service) => (
                        <div key={service.id} className="service-card glass-card p-10 rounded-3xl flex flex-col group hover:bg-[#1c1c1e] transition-colors border border-white/5">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-white">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-base font-normal">
                                {service.description}
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                Learn more <span className="ml-2">&rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
