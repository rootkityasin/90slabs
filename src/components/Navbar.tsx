'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils' // Wait, I need to check if utils exists, create it if not.
// Actually I'll create utils first or inline it. I'll inline for now or create lib/utils.ts

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Projects', href: '#projects' },
        { name: 'Services', href: '#services' },
        { name: 'Members', href: '#members' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'py-4 bg-[#fafaf7]/90 backdrop-blur-xl border-[#008f7d]/20 shadow-lg' : 'py-8 bg-transparent border-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="group relative text-2xl font-bold tracking-tighter text-[#1a1a2e]">
                    <span className="relative z-10">90sX</span>
                    <div className="absolute inset-0 bg-[#008f7d]/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium text-[#4a5568] hover:text-[#008f7d] transition-colors relative group">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#008f7d] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link href="#contact" className="px-5 py-2 text-sm font-bold bg-[#008f7d] text-white rounded-full hover:bg-[#007a6b] transition-colors shadow-[0_0_15px_rgba(0,143,125,0.3)] hover:shadow-[0_0_20px_rgba(0,143,125,0.5)]">
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
