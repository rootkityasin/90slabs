'use client'

import { FormEvent, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')

    const toggleChat = () => setIsOpen((prev) => !prev)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!message.trim()) return
        setMessage('')
    }

    const pathname = usePathname()
    if (pathname?.startsWith('/admin')) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <motion.button
                type="button"
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                className="rounded-full bg-gradient-to-tr from-[#00a08d] to-[#008f7d] p-4 shadow-2xl shadow-[#00342e]/60 text-white flex items-center justify-center"
                animate={isOpen ? { scale: 1.02 } : { scale: [1, 1.04, 1] }}
                transition={{ duration: 1.6, repeat: isOpen ? 0 : Infinity, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 3C7 3 3 6.75 3 11.25c0 2.61 1.32 5 3.4 6.67L6 21l3.42-2c.88.24 1.82.37 2.58.37 5 0 9-3.75 9-8.25S17 3 12 3z" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-72 max-w-sm bg-white/90 text-[#0b1220] rounded-2xl shadow-2xl border border-[#0b1220]/5 backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0b1220]/10">
                            <div>
                                <p className="text-sm font-semibold">Need help?</p>
                                <p className="text-xs text-[#0b1220]/60">We usually reply within minutes</p>
                            </div>
                            <button
                                type="button"
                                onClick={toggleChat}
                                className="text-[#0b1220]/70 hover:text-[#0b1220]"
                                aria-label="Close chat box"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-3 space-y-2 text-sm text-[#0b1220]/70">
                            <p>Hello there 👋</p>
                            <p>Drop your message and someone from our team will get back shortly.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-4 pb-4">
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Type your question…"
                                className="w-full h-20 resize-none rounded-xl border border-[#0b1220]/10 bg-[#001210]/5 px-3 py-2 text-sm text-[#0b1220] focus:outline-none focus:border-[#0b1220]"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-[#0b1220] text-white py-2 text-sm font-semibold hover:bg-[#0b1220]/90 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
