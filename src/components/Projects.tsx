'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface Project {
    id: number
    title: string
    category: string
    image: string
    year: string
    description: string
    tech?: string[]
}

export default function Projects() {
    const container = useRef<HTMLDivElement>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/projects')
                if (response.ok) {
                    const result = await response.json()
                    setProjects(result)
                }
            } catch (error) {
                console.error('Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Animation variants removed

    if (loading) {
        return (
            <section id="projects" className="py-20 md:py-32 relative bg-[#fafaf7] overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full" />
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0) {
        return null
    }

    return (
        <section id="projects" ref={container} className="py-20 md:py-32 relative bg-[#fafaf7] overflow-hidden">
            {/* Liquid Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#008f7d]/05 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 md:mb-6 text-[#1a1a2e] tracking-tight">
                            Selected Works
                        </h2>
                        <p className="text-[#4a5568] text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                            A curation of digital products that define the future.
                        </p>
                    </div>
                </div>

                <div className="space-y-16 md:space-y-32">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-12 lg:gap-20 items-center`}
                        >
                            {/* Project Image */}
                            <div className="w-full lg:w-3/5 group relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#008f7d]/20 to-[#008f7d]/20 rounded-3xl blur-2xl opacity-0" />
                                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#008f7d]/30 aspect-video glass-card">
                                    <div className="absolute inset-0 bg-[#008f7d]/40 z-10" />
                                    {/* Placeholder for actual image if available, or just a gradient div */}
                                    <div className="w-full h-full bg-gradient-to-br from-[#008f7d]/20 to-[#f5f5f0] flex items-center justify-center p-10">
                                        <div className="text-[#008f7d]/20 text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-center break-words">
                                            {project.title}
                                        </div>
                                    </div>
                                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="w-full lg:w-2/5 flex flex-col justify-center">
                                <div className="flex items-center gap-3 sm:gap-4 mb-4 md:mb-6 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#4a5568]">
                                    <span>{project.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#008f7d]" />
                                    <span>{project.category}</span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-[#1a1a2e]">
                                    {project.title}
                                </h3>

                                <p className="text-[#4a5568] leading-relaxed text-base md:text-lg mb-6 md:mb-8">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 md:mb-10">
                                    {project.tech?.map((tech) => (
                                        <span key={tech} className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#008f7d]/10 text-[#008f7d] border border-[#008f7d]/20 backdrop-blur-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <Link href="#" className="inline-flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base text-[#008f7d] font-semibold tracking-wide w-fit">
                                    <span className="border-b border-[#008f7d]/30 pb-0.5">View Case Study</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
