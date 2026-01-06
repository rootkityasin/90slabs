'use client'

import projectsData from '@/data/projects.json'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Horizontal scroll implementation
            // We need to make sure the container is wide enough
            const totalWidth = projectsData.length * 100 // Approximation or use calc

            // Simple grid for now to be safe, easier to make responsive quickly. 
            // For "horizontal scroll" effect we can use a sticky container.
            // Let's do a nice horizontal scroll within a sticky section.

            if (sectionRef.current && triggerRef.current) {
                const scrollTween = gsap.to(sectionRef.current, {
                    x: - (sectionRef.current.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        pin: true,
                        scrub: 1,
                        end: '+=2000', // Scroll distance
                    }
                })
            }

        }, triggerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="projects" className="overflow-hidden bg-black relative">
            {/* Desktop: Horizontal Scroll Trigger Wrapper */}
            <div ref={triggerRef} className="hidden md:block">
                <div className="h-screen flex items-center bg-zinc-950 border-t border-white/5 relative overflow-hidden">
                    <div className="container mx-auto px-6 absolute top-12 left-0 z-10">
                        <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">Our Work</span>
                        <h2 className="text-6xl font-bold text-white mb-2">Selected Projects</h2>
                    </div>

                    <div ref={sectionRef} className="flex gap-16 px-20 mt-32">
                        {projectsData.map((project, index) => (
                            <div key={project.id} className="project-card relative w-[600px] h-[450px] flex-shrink-0 rounded-3xl overflow-hidden group cursor-none">
                                {/* Image Background */}
                                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-primary font-mono text-sm mb-3 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.category}</span>
                                    <h3 className="text-4xl font-bold text-white mb-4">{project.title}</h3>
                                    <div className="h-px w-full bg-white/20 group-hover:w-full transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: Vertical Grid */}
            <div className="md:hidden py-24 px-6 bg-zinc-950 border-t border-white/5">
                <div className="mb-12">
                    <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">Our Work</span>
                    <h2 className="text-4xl font-bold text-white">Selected Projects</h2>
                </div>

                <div className="flex flex-col gap-12">
                    {projectsData.map((project) => (
                        <div key={project.id} className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                            <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <span className="text-primary text-xs font-mono mb-2 block">{project.category}</span>
                                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
