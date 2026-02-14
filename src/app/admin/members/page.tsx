'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash, Save, Edit2, Loader2, X } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/context/ToastContext'

interface Member {
    name: string
    role: string
    image: string
}

export default function AdminMembers() {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<Member[]>([])
    const [editingMember, setEditingMember] = useState<string | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [formData, setFormData] = useState<Member>({
        name: '',
        role: '',
        image: ''
    })

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/admin/members')
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
            const data = await res.json()
            setMembers(data)
        } catch (error) {
            console.error(error)
            showToast(`Failed to fetch members: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const startCreate = () => {
        setEditingMember('new')
        setIsNew(true)
        setFormData({ name: '', role: '', image: '' })
    }

    const startEdit = (member: Member) => {
        setEditingMember(member.name)
        setIsNew(false)
        setFormData({ ...member })
    }

    const cancelEdit = () => {
        setEditingMember(null)
        setIsNew(false)
        setFormData({ name: '', role: '', image: '' })
    }

    const handleSave = async () => {
        const endpoint = '/api/admin/members'
        const method = isNew ? 'POST' : 'PUT'

        try {
            const body = isNew ? formData : { originalName: editingMember, ...formData }

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                fetchMembers()
                cancelEdit()
                showToast('Member saved successfully', 'success')
            } else {
                showToast('Failed to save member', 'error')
            }
        } catch (e) {
            showToast('Error saving member', 'error')
        }
    }

    const handleDelete = async (name: string) => {
        if (!confirm('Delete this team member?')) return
        try {
            const res = await fetch(`/api/admin/members?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
            if (res.ok) {
                fetchMembers()
                showToast('Member deleted', 'success')
            }
        } catch (e) {
            showToast('Error deleting member', 'error')
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Team</h1>
                {!editingMember && (
                    <button onClick={startCreate} className="bg-[#008f7d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#007a6b] w-full md:w-auto justify-center">
                        <Plus className="w-4 h-4" /> Add Member
                    </button>
                )}
            </div>

            {editingMember && (
                <div className="bg-white p-4 md:p-6 rounded-xl border border-[#008f7d]/30 shadow-lg mb-8">
                    <h2 className="text-xl font-bold mb-4">{isNew ? 'New Member' : 'Edit Member'}</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <input
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Avatar</label>
                            <ImageUpload
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                resolution="500x500"
                                aspectRatio="1:1"
                                apiKey="admin"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
                        <button onClick={cancelEdit} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded order-2 md:order-1">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-[#008f7d] text-white rounded hover:bg-[#007a6b] flex items-center justify-center gap-2 order-1 md:order-2">
                            <Save className="w-4 h-4" /> Save Member
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#008f7d] text-white font-bold text-xl">
                                    {member.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(member)} className="p-1.5 text-gray-400 hover:text-[#008f7d] hover:bg-[#008f7d]/10 rounded">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(member.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
