'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

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

    if (loading) {
        return (
            <section id="projects" className="py-32 relative bg-[#001210] overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-[#008f7d]/30 border-t-[#008f7d] rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0) {
        return null
    }

    return (
        <section id="projects" ref={container} className="py-32 relative bg-[#001210] overflow-hidden">
            {/* Liquid Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#008f7d]/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,244,183,0.1)]">
                            Selected Works
                        </h2>
                        <p className="text-[#FFF4B7]/80 text-xl font-normal leading-relaxed">
                            A curation of digital products that define the future.
                        </p>
                    </div>
                </div>

                <div className="space-y-32">
                    {projects.map((project, index) => (
                        <div key={project.id} className={`project-card flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                            {/* Project Image */}
                            <div className="w-full lg:w-3/5 group relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#008f7d]/20 to-[#008f7d]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative overflow-hidden rounded-2xl border border-[#008f7d]/30 aspect-video glass-card">
                                    <div className="absolute inset-0 bg-[#008f7d]/40 transition-opacity duration-500 group-hover:opacity-0 z-10" />
                                    {/* Placeholder for actual image if available, or just a gradient div */}
                                    <div className="w-full h-full bg-gradient-to-br from-[#008f7d]/60 to-[#001210]/60 flex items-center justify-center p-10">
                                        <div className="text-[#FFF4B7]/20 text-6xl font-bold uppercase tracking-tighter">
                                            {project.title}
                                        </div>
                                    </div>
                                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="w-full lg:w-2/5 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6 text-sm font-medium tracking-wider uppercase text-[#FFF4B7]/60">
                                    <span>{project.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#008f7d]" />
                                    <span>{project.category}</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white group-hover:text-[#FFF4B7] transition-colors duration-300">
                                    {project.title}
                                </h3>

                                <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-10">
                                    {project.tech?.map((tech) => (
                                        <span key={tech} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#008f7d]/10 text-[#FFF4B7] border border-[#008f7d]/20 backdrop-blur-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <Link href="#" className="inline-flex items-center gap-3 text-[#FFF4B7] font-semibold tracking-wide group/link w-fit">
                                    <span className="border-b border-[#FFF4B7]/30 pb-0.5 group-hover/link:border-[#FFF4B7] transition-colors">View Case Study</span>
                                    <ArrowUpRight className="w-5 h-5 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
