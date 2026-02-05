'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
    message: string
    type: ToastType
    onClose: () => void
}

const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
}

const bgColors = {
    success: 'bg-emerald-50/90 border-emerald-100',
    error: 'bg-red-50/90 border-red-100',
    info: 'bg-blue-50/90 border-blue-100'
}

export function Toast({ message, type, onClose }: ToastProps) {
    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border backdrop-blur-sm ${bgColors[type]}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>

            <p className="flex-1 text-sm font-medium text-gray-800">
                {message}
            </p>

            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
