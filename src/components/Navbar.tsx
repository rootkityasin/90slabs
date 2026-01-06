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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'py-4 bg-black/50 backdrop-blur-xl border-white/5' : 'py-8 bg-transparent border-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="group relative text-2xl font-bold tracking-tighter">
                    <span className="relative z-10">90sX</span>
                    <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link href="#contact" className="px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                        Let's Talk
                    </Link>
                </div>

                {/* Mobile Menu Button Placeholder */}
                <div className="md:hidden">
                    <button className="text-white p-2">
                        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </button>
                </div>
            </div>
        </nav>
    )
}
