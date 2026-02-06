'use client'

import { useState, useEffect } from 'react'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const [contactInfo, setContactInfo] = useState({
        heading: "Ready to make waves?",
        subheading: "Let's build something extraordinary together. Reach out to us for your next digital venture.",
        socials: {
            twitter: '#',
            instagram: '#',
            linkedin: '#'
        },
        email: 'hello@90sx.agency'
    })

    useEffect(() => {
        fetch('/api/contact/info')
            .then(res => res.json())
            .then(data => {
                if (data && data.heading) setContactInfo(data)
            })
            .catch(err => console.error(err))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMessage('')

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', message: '' })
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'Something went wrong')
            }
        } catch {
            setStatus('error')
            setErrorMessage('Failed to send message. Please try again.')
        }
    }

    return (
        <section id="contact" className="py-32 bg-[#f5f5f0] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#008f7d]/05 to-transparent pointer-events-none"></div>
            {/* Big Blur behind */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#008f7d]/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <span className="text-[#008f7d] font-mono text-sm tracking-widest uppercase mb-6 block animate-pulse">Start Your Journey</span>

                <h2 className="text-5xl md:text-8xl font-bold mb-10 text-[#1a1a2e] tracking-tighter leading-none max-w-4xl">
                    {contactInfo.heading}
                </h2>

                <p className="text-xl md:text-2xl text-[#4a5568] mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    {contactInfo.subheading}
                </p>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-6 mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full px-6 py-4 bg-white border border-[#008f7d]/20 rounded-2xl text-[#1a1a2e] placeholder:text-[#4a5568]/60 focus:outline-none focus:border-[#008f7d] focus:ring-2 focus:ring-[#008f7d]/20 transition-all duration-300"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            className="w-full px-6 py-4 bg-white border border-[#008f7d]/20 rounded-2xl text-[#1a1a2e] placeholder:text-[#4a5568]/60 focus:outline-none focus:border-[#008f7d] focus:ring-2 focus:ring-[#008f7d]/20 transition-all duration-300"
                        />
                    </div>

                    <div className="relative">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            required
                            rows={5}
                            className="w-full px-6 py-4 bg-white border border-[#008f7d]/20 rounded-2xl text-[#1a1a2e] placeholder:text-[#4a5568]/60 focus:outline-none focus:border-[#008f7d] focus:ring-2 focus:ring-[#008f7d]/20 transition-all duration-300 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full px-12 py-5 bg-[#008f7d] text-white font-bold text-lg rounded-full hover:scale-[1.02] transition-all duration-300 hover:bg-[#007a6b] hover:shadow-[0_0_40px_rgba(0,143,125,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : 'Send Message'}
                    </button>

                    {/* Status Messages */}
                    {status === 'success' && (
                        <div className="p-4 bg-[#008f7d]/10 border border-[#008f7d]/30 rounded-xl text-[#008f7d] animate-fade-in">
                            ✓ Message sent successfully! We'll get back to you soon.
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 animate-fade-in">
                            ✗ {errorMessage}
                        </div>
                    )}
                </form>

                <footer className="mt-28 w-full border-t border-[#008f7d]/20 pt-10 flex flex-col md:flex-row justify-between items-center text-[#4a5568] text-sm font-mono">
                    <p>&copy; {new Date().getFullYear()} 90sLabs Agency.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href={contactInfo.socials.twitter} className="hover:text-[#008f7d] transition-colors">Twitter</a>
                        <a href={contactInfo.socials.instagram} className="hover:text-[#008f7d] transition-colors">Instagram</a>
                        <a href={contactInfo.socials.linkedin} className="hover:text-[#008f7d] transition-colors">LinkedIn</a>
                    </div>
                </footer>
            </div>
        </section>
    )
}
