'use client'

import { FormEvent, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
        { role: 'model', content: 'Hello!  **Welcome to 90sLabs**\n\nI can help you with:\n- **AI Services**\n- **Web Development**\n- **Our Projects**\n\nAsk me anything!' }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const toggleChat = () => setIsOpen((prev) => !prev)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!message.trim() || isLoading) return

        const userMsg = message.trim()
        setMessage('')
        setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content }))
                }),
            })

            const data = await response.json()

            if (data.message) {
                setMessages((prev) => [...prev, { role: 'model', content: data.message }])
            } else {
                setMessages((prev) => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }])
            }
        } catch (error) {
            console.error(error)
            setMessages((prev) => [...prev, { role: 'model', content: "Sorry, checking connection failed." }])
        } finally {
            setIsLoading(false)
        }
    }

    const pathname = usePathname()
    if (pathname?.startsWith('/admin')) return null

    return (
        <>
            <style jsx global>{`
                @keyframes rgb-glow-animation {
                    66% { box-shadow: 0 0 30px 10px rgba(0, 255, 234, 0.53), 0 0 60px 20px rgba(60, 0, 255, 0.5), inset 0 0 20px rgba(0, 94, 255, 0.3); }
                }
                .chat-rgb-glow {    
                    animation: rgb-glow-animation 4s linear infinite !important;
                }
                .chat-messages-scroll {
                    overflow-y: scroll !important;
                    -webkit-overflow-scrolling: touch !important;
                    overscroll-behavior: contain !important;
                    touch-action: pan-y !important;
                }
                .chat-messages-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .chat-messages-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-messages-scroll::-webkit-scrollbar-thumb {
                    background: rgba(0, 160, 141, 0.3);
                    border-radius: 3px;
                }
                .chat-messages-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 160, 141, 0.5);
                }
            `}</style>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                <motion.div
                    className="overflow-hidden relative shadow-2xl z-50 backdrop-blur-md border border-indigo-500/10"
                    animate={{
                        width: isOpen ? 320 : 64,
                        height: isOpen ? 500 : 64,
                        borderRadius: isOpen ? 16 : 9999,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 25,
                        mass: 0.8,
                        duration: 0.4
                    }}
style={{
  maxWidth: 'calc(100vw - 48px)',
  background: isOpen
    ? '#ffffff'
    : 'radial-gradient(circle at center, #22d3ee 0%, #6366f1 45%, #8b5cf6 100%)'
}}

                    onClick={!isOpen ? toggleChat : undefined}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {!isOpen ? (
                            <motion.div
                                key="icon"
                                className="absolute inset-0 flex items-center justify-center text-white cursor-pointer"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-md">
                                    <path d="M12 3C7 3 3 6.75 3 11.25c0 2.61 1.32 5 3.4 6.67L6 21l3.42-2c.88.24 1.82.37 2.58.37 5 0 9-3.75 9-8.25S17 3 12 3z" />
                                </svg>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="window"
                                className="flex flex-col h-full w-full pointer-events-auto cursor-default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[#0b1220]/10 bg-white/50 shrink-0">
                                    <div>
                                        <p className="text-sm font-semibold text-[#0b1220]">AI Assistant 🤖</p>
                                        <p className="text-xs text-[#0b1220]/60 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            Online
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleChat();
                                        }}
                                        className="text-[#0b1220]/70 hover:text-[#0b1220] text-2xl leading-none p-1"
                                        aria-label="Close chat box"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="chat-messages-scroll flex-1 p-4 space-y-4">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                                ? 'bg-[#00a08d] text-white rounded-br-none'
                                                : 'bg-[#f0f2f5] text-[#0b1220] rounded-bl-none'
                                                }`}>
                                                {msg.role === 'model' ? (
                                                    <div className="prose prose-sm max-w-none prose-p:leading-tight prose-ul:pl-4 prose-ul:list-disc">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                a: ({ node, ...props }) => <a className="text-[#00a08d] underline hover:text-[#008f7d]" target="_blank" rel="noopener noreferrer" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="pl-4 list-disc mb-2" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="pl-4 list-decimal mb-2" {...props} />,
                                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    msg.content.split('\n').map((line, i) => (
                                                        <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-[#f0f2f5] text-[#0b1220] p-3 rounded-2xl rounded-bl-none text-sm border border-slate-200">
                                                <div className="flex gap-1">
                                                    <span className="animate-bounce">.</span>
                                                    <span className="animate-bounce delay-100">.</span>
                                                    <span className="animate-bounce delay-200">.</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSubmit} className="p-3 border-t border-[#0b1220]/10 bg-white/50 shrink-0">
                                    <div className="flex gap-2">
                                        <input
                                            value={message}
                                            onChange={(event) => setMessage(event.target.value)}
                                            placeholder="Type your question…"
                                            className="flex-1 rounded-xl border border-[#0b1220]/10 bg-white px-3 py-2 text-sm text-[#0b1220] focus:outline-none focus:border-[#00a08d] placeholder:text-gray-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading || !message.trim()}
                                            className="rounded-xl bg-[#0b1220] text-white px-4 py-2 text-sm font-semibold hover:bg-[#0b1220]/90 transition-colors disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    )
}
