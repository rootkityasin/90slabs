'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                setError('Invalid password')
            }
        } catch (e) {
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-[#008f7d]/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-[#008f7d]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                    <p className="text-gray-500 text-sm mt-1">Enter your secure key to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin Key"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#008f7d] focus:ring-1 focus:ring-[#008f7d] transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#008f7d] text-white py-3 rounded-lg font-semibold hover:bg-[#007a6b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">Powered by 90sX Agency</p>
                </div>
            </div>
        </div>
    )
}
