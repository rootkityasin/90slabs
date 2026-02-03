'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState<string>('home')
    const isProgrammatic = useRef(false)
    const scrollTimeout = useRef<number | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const ids = ['about', 'services', 'projects', 'members', 'contact']
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // ignore updates while we're programmatically scrolling
                        if (!(isProgrammatic.current)) {
                            setActive(entry.target.id)
                        }
                    }
                })
            },
            { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.35 }
        )

        ids.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        const onTop = () => {
            if (window.scrollY < 100 && !(isProgrammatic.current)) setActive('home')
        }
        window.addEventListener('scroll', onTop)

        return () => {
            observer.disconnect()
            window.removeEventListener('scroll', onTop)
        }
    }, [])


    const handleNavClick = (e: React.MouseEvent, href: string) => {

        if (href === '/') {
            e.preventDefault()
            isProgrammatic.current = true
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setActive('home')
            if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
            scrollTimeout.current = window.setTimeout(() => { isProgrammatic.current = false }, 900)
            return
        }
        if (href.startsWith('#')) {
            e.preventDefault()
            const id = href.slice(1)
            const el = document.getElementById(id)
            if (el) {
                isProgrammatic.current = true
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActive(id)
                if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
                scrollTimeout.current = window.setTimeout(() => { isProgrammatic.current = false }, 900)
            }
        }
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Projects', href: '#projects' },
        { name: 'Members', href: '#members' },
        { name: 'Contact Us', href: '#contact' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'py-4 bg-[#fafaf7]/90 backdrop-blur-xl border-[#008f7d]/20 shadow-lg' : 'py-8 bg-transparent border-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="group relative text-2xl font-bold tracking-tighter text-[#1a1a2e]">
                    <span className="relative z-10">90sX</span>
                    <div className="absolute inset-0 bg-[#008f7d]/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => {
                        const key = link.href.startsWith('#') ? link.href.slice(1) : (link.href === '/' ? 'home' : link.href)
                        const isActive = active === key

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e as any, link.href)}
                                className={cn(
                                    'text-sm font-medium relative group transition-colors',
                                    isActive ? 'text-[#008f7d]' : 'text-[#4a5568]'
                                )}
                            >
                                {link.name}
                                <span className={cn('absolute -bottom-1 left-0 h-px bg-[#008f7d] transition-all duration-300', isActive ? 'w-full' : 'w-0', 'group-hover:w-full')}></span>
                            </Link>
                        )
                    })}
                    <Link href="#contact" onClick={(e) => handleNavClick(e as any, '#contact')} className="px-5 py-2 text-sm font-bold bg-[#008f7d] text-white rounded-full hover:bg-[#007a6b] transition-colors shadow-[0_0_15px_rgba(0,143,125,0.3)] hover:shadow-[0_0_20px_rgba(0,143,125,0.5)]">
                        Let's Talk
                    </Link>
                </div>

                {/* Mobile Menu Button Placeholder */}
                <div className="md:hidden">
                    <button className="text-[#1a1a2e] p-2">
                        <div className="w-6 h-0.5 bg-[#008f7d] mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-[#008f7d]"></div>
                    </button>
                </div>
            </div>
        </nav>
    )
}
