'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export default function AdminContact() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState({
        heading: '',
        subheading: '',
        email: '',
        socials: {
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/contact')
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                const jsonData = await res.json()
                // Ensure socials object exists
                if (!jsonData.socials) jsonData.socials = { twitter: '', instagram: '', linkedin: '' }
                setData(jsonData)
            } catch (error) {
                console.error('Error fetching contact info:', error)
                showToast('Failed to fetch contact info', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [showToast])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (res.ok) showToast('Contact info updated!', 'success')
            else showToast('Failed to update', 'error')
        } catch (e) {
            showToast('Error saving', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0 pb-32">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Contact Section</h1>

            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold mb-4">Headings & Text</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                    <input
                        value={data.heading}
                        onChange={e => setData({ ...data, heading: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                    <textarea
                        value={data.subheading}
                        onChange={e => setData({ ...data, subheading: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold mb-4">Contact & Socials</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                        value={data.email}
                        onChange={e => setData({ ...data, email: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                        <input
                            value={data.socials.twitter}
                            onChange={e => setData({ ...data, socials: { ...data.socials, twitter: e.target.value } })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input
                            value={data.socials.instagram}
                            onChange={e => setData({ ...data, socials: { ...data.socials, instagram: e.target.value } })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                            value={data.socials.linkedin}
                            onChange={e => setData({ ...data, socials: { ...data.socials, linkedin: e.target.value } })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-2 bg-[#008f7d] text-white text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-2xl hover:bg-[#007a6b] transition-all disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
            </button>
        </div>
    )
}
