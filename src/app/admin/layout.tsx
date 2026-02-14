'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Mail,
    Menu,
    LogOut,
    ImageIcon,
    Layers,
    X,
} from 'lucide-react'
import { ToastProvider, useToast } from '@/context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ToastProvider>
            <AdminContent>{children}</AdminContent>
        </ToastProvider>
    )
}

function AdminContent({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { showToast } = useToast()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Hide sidebar on login page
    if (pathname === '/admin/login') {
        return <div className={inter.className}>{children}</div>
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Hero & About', href: '/admin/hero', icon: ImageIcon },
        { name: 'Services', href: '/admin/services', icon: Layers },
        { name: 'Projects', href: '/admin/projects', icon: Briefcase },
        { name: 'Team Members', href: '/admin/members', icon: Users },
        { name: 'Navbar', href: '/admin/navbar', icon: Menu },
        { name: 'Contact Info', href: '/admin/contact', icon: Mail },
    ]

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' })
            showToast('Logged out successfully', 'success')
            setTimeout(() => {
                router.push('/admin/login')
                router.refresh()
            }, 1000)
        } catch (e) {
            console.error('Logout failed', e)
            showToast('Logout failed', 'error')
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className={`min-h-screen bg-gray-50 flex ${inter.className}`}>
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 max-w-[85vw] bg-white border-r border-gray-200 fixed h-full z-30 transition-transform duration-300 ease-in-out flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:block
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-base sm:text-xl font-bold text-[#008f7d] truncate">90sLabs Admin</span>
                    <button
                        className="md:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-3 md:p-4 space-y-1 overflow-y-auto flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3.5 md:px-4 py-2.5 md:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-[#008f7d]/10 text-[#008f7d]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#008f7d]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="w-full p-4 border-t border-gray-100 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen w-full">
                <header className="h-16 border-b border-gray-200 px-3 sm:px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-white/80">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={toggleMobileMenu}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-sm sm:text-base text-gray-700 font-semibold truncate">
                            {navItems.find(i => i.href === pathname)?.name || 'Content Management'}
                        </h1>
                    </div>
                </header>

                <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

