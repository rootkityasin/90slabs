'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/context/ToastContext'

interface HeroData {
    label: string
    graphicText: string
    title: string
    titleHighlight: string
    paragraphs: string[]
    images: string[]
    partnerLogos: string[]
}

export default function AdminHero() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<HeroData>({
        label: '',
        graphicText: '',
        title: '',
        titleHighlight: '',
        paragraphs: [],
        images: [],
        partnerLogos: []
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/about')
                if (!res.ok) throw new Error('Failed to fetch')
                const jsonData = await res.json()
                setData(jsonData)
            } catch (error) {
                console.error(error)
                showToast('Failed to load data', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [showToast])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            if (res.ok) showToast('Hero & About section updated!', 'success')
            else showToast('Failed to update', 'error')
        } catch (e) {
            showToast('Error saving', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleParagraphChange = (index: number, value: string) => {
        const newParagraphs = [...data.paragraphs]
        newParagraphs[index] = value
        setData({ ...data, paragraphs: newParagraphs })
    }

    const addParagraph = () => {
        setData({ ...data, paragraphs: [...data.paragraphs, ''] })
    }

    const removeParagraph = (index: number) => {
        const newParagraphs = data.paragraphs.filter((_, i) => i !== index)
        setData({ ...data, paragraphs: newParagraphs })
    }

    const addImage = (url: string) => {
        if (url) setData({ ...data, images: [...data.images, url] })
    }

    const removeImage = (index: number) => {
        setData({ ...data, images: data.images.filter((_, i) => i !== index) })
    }

    const addLogo = (url: string) => {
        if (url) setData({ ...data, partnerLogos: [...data.partnerLogos, url] })
    }

    const removeLogo = (index: number) => {
        setData({ ...data, partnerLogos: data.partnerLogos.filter((_, i) => i !== index) })
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Hero & About</h1>

            {/* Text Content */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold mb-4">Text Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label (Small Text)</label>
                        <input
                            value={data.label || ''}
                            onChange={e => setData({ ...data, label: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Graphic Text (e.g. EST. 199X)</label>
                        <input
                            value={data.graphicText || ''}
                            onChange={e => setData({ ...data, graphicText: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Title</label>
                        <input
                            value={data.title || ''}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight (Accent Color)</label>
                        <input
                            value={data.titleHighlight || ''}
                            onChange={e => setData({ ...data, titleHighlight: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Paragraphs</label>
                        <button onClick={addParagraph} className="text-[#008f7d] text-sm flex items-center gap-1 hover:bg-[#008f7d]/5 px-2 py-1 rounded">
                            <Plus className="w-3 h-3" /> Add Paragraph
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.paragraphs.map((p, idx) => (
                            <div key={idx} className="flex gap-2">
                                <textarea
                                    value={p}
                                    onChange={e => handleParagraphChange(idx, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                                <button onClick={() => removeParagraph(idx)} className="text-red-400 hover:text-red-500 p-2">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold mb-4">Hero Images</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Image</label>
                    <ImageUpload
                        onChange={addImage}
                        resolution="1920x1080"
                        aspectRatio="16:9"
                        apiKey="admin"
                        value=""
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {data.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img src={img} alt="Hero" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Partner Logos */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 space-y-6">
                <h2 className="text-xl font-bold mb-4">Partner Logos</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                    <ImageUpload
                        onChange={addLogo}
                        resolution="200x200"
                        aspectRatio="1:1"
                        apiKey="admin"
                        value=""
                    />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {data.partnerLogos.map((logo, idx) => (
                        <div key={idx} className="relative group aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-200">
                            <img src={logo} alt="Partner" className="max-w-full max-h-full object-contain" />
                            <button
                                onClick={() => removeLogo(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
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
