'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash, Save, Edit2, Loader2, X } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/context/ToastContext'

interface Project {
    id: number
    title: string
    category: string
    year: string
    description: string
    tech: string[]
    link: string
    image: string
}

export default function AdminProjects() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [projects, setProjects] = useState<Project[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Partial<Project>>({})

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects')
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
            const data = await res.json()
            setProjects(data)
        } catch (error) {
            console.error(error)
            showToast(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [showToast])

    const startCreate = () => {
        setEditingId(0)
        setFormData({ tech: [] })
    }

    const startEdit = (project: Project) => {
        setEditingId(project.id)
        setFormData(project)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({})
    }

    const handleSave = async () => {
        const isNew = editingId === 0
        const endpoint = '/api/admin/projects'
        const method = isNew ? 'POST' : 'PUT'

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isNew ? formData : { id: editingId, ...formData })
            })

            if (res.ok) {
                fetchProjects()
                cancelEdit()
                showToast('Project saved successfully', 'success')
            } else {
                showToast('Failed to save project', 'error')
            }
        } catch (e) {
            showToast('Error saving project', 'error')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this project?')) return
        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchProjects()
                showToast('Project deleted', 'success')
            }
        } catch (e) {
            showToast('Error deleting project', 'error')
        }
    }

    const handleTechChange = (str: string) => {
        setFormData({ ...formData, tech: str.split(',').map(s => s.trim()).filter(Boolean) })
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-8 px-4 md:px-0 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Projects</h1>
                {!editingId && (
                    <button onClick={startCreate} className="bg-[#008f7d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#007a6b] w-full md:w-auto justify-center">
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                )}
            </div>

            {editingId !== null && (
                <div className="bg-white p-4 md:p-6 rounded-xl border border-[#008f7d]/30 shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-4">{editingId === 0 ? 'New Project' : 'Edit Project'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    value={formData.title || ''}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        value={formData.category || ''}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        value={formData.year || ''}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                                <input
                                    value={formData.tech?.join(', ') || ''}
                                    onChange={e => handleTechChange(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="React, Next.js, Tailwind"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                                <input
                                    value={formData.link || ''}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Project Image</label>
                            <ImageUpload
                                value={formData.image || ''}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                resolution="1920x1080"
                                aspectRatio="16:9"
                                apiKey="admin"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
                        <button onClick={cancelEdit} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded order-2 md:order-1">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-[#008f7d] text-white rounded hover:bg-[#007a6b] flex items-center justify-center gap-2 order-1 md:order-2">
                            <Save className="w-4 h-4" /> Save Project
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative">
                            {project.image ? (
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => startEdit(project)} className="p-2 bg-white/90 rounded-full shadow hover:text-[#008f7d]">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/90 rounded-full shadow hover:text-red-500">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">{project.category} • {project.year}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
