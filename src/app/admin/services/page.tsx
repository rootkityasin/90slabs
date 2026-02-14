'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash, Save, Edit2, Loader2, GripVertical, Check, X } from 'lucide-react'
import { useToast } from '@/context/ToastContext'

import { Category, Service, ServicesData } from '@/lib/types'

export default function AdminServices() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [editingCategory, setEditingCategory] = useState<string | null>(null)
    const [catForm, setCatForm] = useState({ title: '', description: '' })
    const [editingService, setEditingService] = useState<number | null>(null)
    const [svcForm, setSvcForm] = useState({ title: '', description: '', icon: '', featured: false })

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services')
            if (res.ok) {
                const data: ServicesData = await res.json()
                setCategories(data.categories)
            }
        } catch (error) {
            console.error('Failed to fetch services', error)
            showToast('Failed to fetch services', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const startEditCategory = (cat: Category) => {
        setEditingCategory(cat.id)
        setCatForm({ title: cat.title, description: cat.description })
        setEditingService(null)
    }

    const saveCategory = async (catId: string) => {
        try {
            const res = await fetch('/api/admin/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updateCategory: true,
                    categoryId: catId,
                    ...catForm
                })
            })
            if (res.ok) {
                fetchServices()
                setEditingCategory(null)
                showToast('Category saved', 'success')
            } else {
                showToast('Failed to save category', 'error')
            }
        } catch (e) {
            showToast('Failed to save category', 'error')
        }
    }

    const startEditService = (svc: Service) => {
        setEditingService(svc.id)
        setSvcForm({
            title: svc.title,
            description: svc.description,
            icon: svc.icon,
            featured: svc.featured || false
        })
        setEditingCategory(null)
    }

    const saveService = async (catId: string, svcId: number) => {
        try {
            const res = await fetch('/api/admin/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: svcId,
                    categoryId: catId,
                    ...svcForm
                })
            })
            if (res.ok) {
                fetchServices()
                setEditingService(null)
                showToast('Service saved', 'success')
            } else {
                showToast('Failed to save service', 'error')
            }
        } catch (e) {
            showToast('Failed to save service', 'error')
        }
    }

    const deleteService = async (svcId: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        try {
            const res = await fetch(`/api/admin/services?serviceId=${svcId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchServices()
                showToast('Service deleted', 'success')
            } else {
                showToast('Failed to delete service', 'error')
            }
        } catch (e) {
            showToast('Failed to delete service', 'error')
        }
    }

    const createService = async (catId: string) => {
        const title = prompt('Enter Service Title:')
        if (!title) return

        try {
            const res = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: catId,
                    title,
                    description: 'New service description',
                    icon: 'Globe',
                    featured: false
                })
            })
            if (res.ok) {
                fetchServices()
                showToast('Service created', 'success')
            } else {
                showToast('Failed to create service', 'error')
            }
        } catch (e) {
            showToast('Failed to create service', 'error')
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-5xl mx-auto space-y-12 px-4 md:px-0">
            <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>

            {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {editingCategory === category.id ? (
                            <div className="flex-1 w-full space-y-2 mr-4">
                                <input
                                    value={catForm.title}
                                    onChange={e => setCatForm({ ...catForm, title: e.target.value })}
                                    className="w-full p-2 border rounded font-semibold"
                                />
                                <input
                                    value={catForm.description}
                                    onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                                    className="w-full p-2 border rounded text-sm"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => saveCategory(category.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1">
                                        <Save className="w-3 h-3" /> Save
                                    </button>
                                    <button onClick={() => setEditingCategory(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {category.title}
                                    <button onClick={() => startEditCategory(category)} className="text-gray-400 hover:text-[#008f7d]">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                            </div>
                        )}

                        <button
                            onClick={() => createService(category.id)}
                            className="bg-[#008f7d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#007a6b] flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            <Plus className="w-4 h-4" /> Add Service
                        </button>
                    </div>

                    {/* Services Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.services.map((service) => (
                            <div
                                key={service.id}
                                className={`relative border rounded-lg p-4 transition-all ${service.featured ? 'border-yellow-400 bg-yellow-50/50' : 'border-gray-200 hover:border-[#008f7d]/30'
                                    }`}
                            >
                                {editingService === service.id ? (
                                    <div className="space-y-3">
                                        <input
                                            value={svcForm.title}
                                            onChange={e => setSvcForm({ ...svcForm, title: e.target.value })}
                                            className="w-full p-2 border rounded text-sm font-semibold"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            value={svcForm.description}
                                            onChange={e => setSvcForm({ ...svcForm, description: e.target.value })}
                                            className="w-full p-2 border rounded text-sm"
                                            rows={2}
                                            placeholder="Description"
                                        />
                                        <div className="flex gap-4">
                                            <input
                                                value={svcForm.icon}
                                                onChange={e => setSvcForm({ ...svcForm, icon: e.target.value })}
                                                className="flex-1 p-2 border rounded text-sm"
                                                placeholder="Icon Name (e.g. Globe)"
                                            />
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={svcForm.featured}
                                                    onChange={e => setSvcForm({ ...svcForm, featured: e.target.checked })}
                                                    id={`feat-${service.id}`}
                                                />
                                                <label htmlFor={`feat-${service.id}`} className="text-sm text-gray-600">Featured</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button onClick={() => saveService(category.id, service.id)} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600">
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingService(null)} className="p-1.5 bg-gray-300 text-gray-600 rounded hover:bg-gray-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800">{service.title}</h3>
                                            <div className="flex items-center gap-1">
                                                {service.featured && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Featured</span>}
                                                <button onClick={() => startEditService(service)} className="p-1.5 text-gray-400 hover:text-[#008f7d] hover:bg-[#008f7d]/10 rounded">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => deleteService(service.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                                    <Trash className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{service.icon}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
