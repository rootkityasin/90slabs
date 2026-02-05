'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash, Save, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface NavbarLink {
    name: string
    href: string
}

interface NavbarData {
    logo: { text: string }
    links: NavbarLink[]
    cta: { text: string; href: string }
}

export default function AdminNavbar() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<NavbarData>({
        logo: { text: '90s Labs' },
        links: [],
        cta: { text: 'Contact Us', href: '#contact' }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/navbar')
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                const jsonData = await res.json()
                setData(jsonData)
            } catch (error) {
                console.error(error)
                showToast(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [showToast])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/navbar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (res.ok) showToast('Navbar updated successfully!', 'success')
            else showToast('Failed to update navbar', 'error')
        } catch (e) {
            showToast('Error saving navbar', 'error')
        } finally {
            setSaving(false)
        }
    }

    const addLink = () => {
        setData(prev => ({
            ...prev,
            links: [...prev.links, { name: 'New Link', href: '#' }]
        }))
    }

    const removeLink = (index: number) => {
        setData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }))
    }

    const updateLink = (index: number, field: 'name' | 'href', value: string) => {
        const newLinks = [...data.links]
        newLinks[index][field] = value
        setData(prev => ({ ...prev, links: newLinks }))
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Manage Navbar</h1>

            {/* Logo Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Logo</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Logo Text</label>
                        <input
                            type="text"
                            value={data.logo.text}
                            onChange={(e) => setData({ ...data, logo: { ...data.logo, text: e.target.value } })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Navigation Links</h2>
                    <button onClick={addLink} className="flex items-center gap-2 text-sm text-[#008f7d] hover:bg-[#008f7d]/5 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /> Add Link
                    </button>
                </div>
                <div className="space-y-3">
                    {data.links.map((link, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                            <input
                                type="text"
                                placeholder="Link Name"
                                value={link.name}
                                onChange={(e) => updateLink(idx, 'name', e.target.value)}
                                className="flex-1 p-2 border rounded-md text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Link Href (#section or /path)"
                                value={link.href}
                                onChange={(e) => updateLink(idx, 'href', e.target.value)}
                                className="flex-1 p-2 border rounded-md text-sm font-mono text-gray-600"
                            />
                            <button onClick={() => removeLink(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Call to Action Button</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Button Text</label>
                        <input
                            type="text"
                            value={data.cta.text}
                            onChange={(e) => setData({ ...data, cta: { ...data.cta, text: e.target.value } })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Link URL</label>
                        <input
                            type="text"
                            value={data.cta.href}
                            onChange={(e) => setData({ ...data, cta: { ...data.cta, href: e.target.value } })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="fixed bottom-8 right-8 flex items-center gap-2 bg-[#008f7d] text-white px-6 py-3 rounded-full shadow-xl hover:bg-[#007a6b] transition-all disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
            </button>
        </div>
    )
}
