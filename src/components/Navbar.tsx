'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

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

    const [navData, setNavData] = useState({
        logo: { text: "90sLabs", image: "" },
        links: [
            { name: 'Home', href: '/' },
            { name: 'About', href: '#about' },
            { name: 'Services', href: '#services' },
            { name: 'Projects', href: '#projects' },
            { name: 'Members', href: '#members' },
            { name: 'Contact Us', href: '#contact' },
        ],
        cta: { text: "Let's Talk", href: "#contact" }
    })

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const res = await fetch('/api/navbar')
                if (res.ok) {
                    const data = await res.json()
                    if (data && data.links) setNavData(data)
                }
            } catch (e) {
                console.error("Failed to fetch navbar", e)
            }
        }
        fetchNav()
    }, [])

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [active])

    const navLinks = navData.links

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'py-3 md:py-4 bg-[#fafaf7]/90 backdrop-blur-xl border-[#008f7d]/20 shadow-lg' : 'py-4 md:py-8 bg-transparent border-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link href="/" className="group relative text-xl sm:text-2xl font-bold tracking-tighter text-[#1a1a2e]">
                    <span className="relative z-10">{navData.logo.text}</span>
                    <div className="absolute inset-0 bg-[#008f7d]/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
                        {navData.cta.text}
                    </Link>
                </div>

                {/* Mobile Menu Button - High Visibility with Z-Index tweak */}
                <div className="md:hidden z-[60] relative">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-black p-2 focus:outline-none hover:bg-black/5 rounded-full transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-7 h-7" strokeWidth={2.5} />
                        ) : (
                            <Menu className="w-7 h-7" strokeWidth={2.5} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop & Drawer */}
            <div className={`fixed inset-0 h-[100dvh] z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-[75vw] sm:w-[400px] bg-[#fafaf7] shadow-2xl flex flex-col items-start justify-start pt-24 pb-10 px-8 space-y-6 overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {navLinks.map((link) => {
                        const key = link.href.startsWith('#') ? link.href.slice(1) : (link.href === '/' ? 'home' : link.href)
                        const isActive = active === key

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    handleNavClick(e as any, link.href)
                                    setIsMobileMenuOpen(false)
                                }}
                                className={cn(
                                    'text-xl font-bold transition-colors w-full border-b border-[#008f7d]/10 pb-4',
                                    isActive ? 'text-[#008f7d]' : 'text-[#4a5568]'
                                )}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                    <Link
                        href="#contact"
                        onClick={(e) => {
                            handleNavClick(e as any, '#contact')
                            setIsMobileMenuOpen(false)
                        }}
                        className="mt-4 w-full text-center px-8 py-3.5 text-base font-bold bg-[#008f7d] text-white rounded-full hover:bg-[#007a6b] transition-colors shadow-lg"
                    >
                        {navData.cta.text}
                    </Link>
                </div>
            </div>
        </nav>
    )
}
