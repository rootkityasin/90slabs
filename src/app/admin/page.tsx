'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Trash2,
    Plus,
    Save,
    Edit3,
    X,
    Key,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Users,
    FolderKanban,
    Layers,
    Home,
    Info
} from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

type Tab = 'projects' | 'members' | 'services' | 'hero' | 'about'

interface Project {
    id: number
    title: string
    category: string
    description: string
    year: string
    image: string
    tech: string[]
}

interface Member {
    id: number
    name: string
    role: string
    image: string
}

interface Service {
    id: number
    title: string
    description: string
    icon: string
    featured?: boolean
}

interface Category {
    id: string
    title: string
    description: string
    services: Service[]
}

interface HeroData {
    headline1: string
    headline2: string
    description: string
    primaryCta: { text: string; href: string }
    secondaryCta: { text: string; href: string }
}

interface AboutData {
    label: string
    title: string
    titleHighlight: string
    paragraphs: string[]
    graphicText: string
    graphicSubtext: string
}

export default function AdminPage() {
    const [apiKey, setApiKey] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeTab, setActiveTab] = useState<Tab>('projects')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Data states
    const [projects, setProjects] = useState<Project[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [services, setServices] = useState<{ categories: Category[] } | null>(null)
    const [hero, setHero] = useState<HeroData | null>(null)
    const [about, setAbout] = useState<AboutData | null>(null)

    // Edit states
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
    const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null)
    const [editingService, setEditingService] = useState<Partial<Service & { categoryId: string }> | null>(null)

    // Load API key from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('admin_api_key')
        if (saved) {
            setApiKey(saved)
            setIsAuthenticated(true)
        }
    }, [])

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage(null), 4000)
    }

    const saveApiKey = () => {
        if (apiKey.length < 10) {
            showMessage('error', 'API key must be at least 10 characters')
            return
        }
        localStorage.setItem('admin_api_key', apiKey)
        setIsAuthenticated(true)
        showMessage('success', 'API key saved')
    }

    const logout = () => {
        localStorage.removeItem('admin_api_key')
        setApiKey('')
        setIsAuthenticated(false)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [projRes, memRes, svcRes, heroRes, aboutRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/members'),
                fetch('/api/services'),
                fetch('/api/hero'),
                fetch('/api/about')
            ])

            if (projRes.ok) setProjects(await projRes.json())
            if (memRes.ok) setMembers(await memRes.json())
            if (svcRes.ok) setServices(await svcRes.json())
            if (heroRes.ok) setHero(await heroRes.json())
            if (aboutRes.ok) setAbout(await aboutRes.json())
        } catch (error) {
            showMessage('error', 'Failed to fetch data')
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            fetchData()
        }
    }, [isAuthenticated, fetchData])

    const apiRequest = async (url: string, method: string, body?: Record<string, unknown>) => {
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': apiKey
                },
                body: body ? JSON.stringify(body) : undefined
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Request failed')
            }
            return data
        } catch (error) {
            throw error
        }
    }

    // === PROJECT HANDLERS ===
    const saveProject = async () => {
        if (!editingProject) return
        setLoading(true)
        try {
            if (editingProject.id) {
                await apiRequest('/api/admin/projects', 'PUT', editingProject)
                showMessage('success', 'Project updated')
            } else {
                await apiRequest('/api/admin/projects', 'POST', editingProject)
                showMessage('success', 'Project created')
            }
            setEditingProject(null)
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to save project')
        }
        setLoading(false)
    }

    const deleteProject = async (id: number) => {
        if (!confirm('Delete this project?')) return
        setLoading(true)
        try {
            await apiRequest(`/api/admin/projects?id=${id}`, 'DELETE')
            showMessage('success', 'Project deleted')
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to delete')
        }
        setLoading(false)
    }

    // === MEMBER HANDLERS ===
    const saveMember = async () => {
        if (!editingMember) return
        setLoading(true)
        try {
            if (editingMember.id) {
                await apiRequest('/api/admin/members', 'PUT', editingMember)
                showMessage('success', 'Member updated')
            } else {
                await apiRequest('/api/admin/members', 'POST', editingMember)
                showMessage('success', 'Member added')
            }
            setEditingMember(null)
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to save member')
        }
        setLoading(false)
    }

    const deleteMember = async (id: number) => {
        if (!confirm('Remove this member?')) return
        setLoading(true)
        try {
            await apiRequest(`/api/admin/members?id=${id}`, 'DELETE')
            showMessage('success', 'Member removed')
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to delete')
        }
        setLoading(false)
    }

    // === SERVICE HANDLERS ===
    const saveService = async () => {
        if (!editingService) return
        setLoading(true)
        try {
            if (editingService.id) {
                await apiRequest('/api/admin/services', 'PUT', { serviceId: editingService.id, ...editingService })
                showMessage('success', 'Service updated')
            } else {
                await apiRequest('/api/admin/services', 'POST', editingService)
                showMessage('success', 'Service added')
            }
            setEditingService(null)
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to save service')
        }
        setLoading(false)
    }

    const deleteService = async (id: number) => {
        if (!confirm('Delete this service?')) return
        setLoading(true)
        try {
            await apiRequest(`/api/admin/services?serviceId=${id}`, 'DELETE')
            showMessage('success', 'Service deleted')
            fetchData()
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to delete')
        }
        setLoading(false)
    }

    // === HERO HANDLER ===
    const saveHero = async () => {
        if (!hero) return
        setLoading(true)
        try {
            await apiRequest('/api/admin/hero', 'PUT', hero)
            showMessage('success', 'Hero updated')
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to update hero')
        }
        setLoading(false)
    }

    // === ABOUT HANDLER ===
    const saveAbout = async () => {
        if (!about) return
        setLoading(true)
        try {
            await apiRequest('/api/admin/about', 'PUT', about)
            showMessage('success', 'About updated')
        } catch (error: unknown) {
            showMessage('error', error instanceof Error ? error.message : 'Failed to update about')
        }
        setLoading(false)
    }

    // Handle image upload (convert to base64)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (img: string) => void) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 500000) {
            showMessage('error', 'Image too large (max 500KB)')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setter(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    // === AUTH SCREEN ===
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#001210] flex items-center justify-center p-6">
                <div className="w-full max-w-md p-8 bg-[#002420] rounded-2xl border border-[#008f7d]/30">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="w-8 h-8 text-[#008f7d]" />
                        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                    </div>
                    <p className="text-[#FFF4B7]/60 mb-6">Enter your admin API key to access the dashboard.</p>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter API Key"
                        className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d] mb-4"
                    />
                    <button
                        onClick={saveApiKey}
                        className="w-full py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors"
                    >
                        Access Dashboard
                    </button>
                </div>
            </div>
        )
    }

    // === MAIN DASHBOARD ===
    return (
        <div className="min-h-screen bg-[#001210]">
            {/* Header */}
            <header className="bg-[#002420] border-b border-[#008f7d]/30 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">90sX Admin</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="p-2 text-[#FFF4B7]/60 hover:text-white transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm text-[#FFF4B7]/60 hover:text-white border border-[#008f7d]/30 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Message Toast */}
            {message && (
                <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex">
                {/* Sidebar */}
                <nav className="w-64 min-h-[calc(100vh-73px)] bg-[#002420] border-r border-[#008f7d]/30 p-4">
                    <ul className="space-y-2">
                        {[
                            { id: 'projects' as Tab, icon: FolderKanban, label: 'Projects' },
                            { id: 'members' as Tab, icon: Users, label: 'Team Members' },
                            { id: 'services' as Tab, icon: Layers, label: 'Services' },
                            { id: 'hero' as Tab, icon: Home, label: 'Hero Section' },
                            { id: 'about' as Tab, icon: Info, label: 'About Section' }
                        ].map(({ id, icon: Icon, label }) => (
                            <li key={id}>
                                <button
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === id
                                        ? 'bg-[#008f7d]/20 text-[#FFF4B7] border border-[#008f7d]/40'
                                        : 'text-gray-400 hover:text-white hover:bg-[#008f7d]/10'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Projects</h2>
                                <button
                                    onClick={() => setEditingProject({ title: '', category: '', description: '', year: new Date().getFullYear().toString(), image: '', tech: [] })}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#008f7d] text-white rounded-xl hover:bg-[#00a08d] transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Project
                                </button>
                            </div>

                            {/* Project Form Modal */}
                            {editingProject && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="w-full max-w-2xl bg-[#002420] rounded-2xl border border-[#008f7d]/30 p-6 max-h-[90vh] overflow-y-auto">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white">{editingProject.id ? 'Edit' : 'Add'} Project</h3>
                                            <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-white">
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Project Title"
                                                value={editingProject.title || ''}
                                                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={editingProject.category || ''}
                                                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={editingProject.year || ''}
                                                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                rows={3}
                                                value={editingProject.description || ''}
                                                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d] resize-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={editingProject.image || ''}
                                                onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tech stack (comma separated)"
                                                value={editingProject.tech?.join(', ') || ''}
                                                onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value.split(',').map(t => t.trim()) })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <button
                                                onClick={saveProject}
                                                disabled={loading}
                                                className="w-full py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Save className="w-4 h-4" /> Save Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Projects List */}
                            <div className="grid gap-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-4 bg-[#002420] rounded-xl border border-[#008f7d]/30 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">{project.title}</h3>
                                            <p className="text-sm text-gray-400">{project.category} · {project.year}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingProject(project)}
                                                className="p-2 text-[#FFF4B7]/60 hover:text-[#FFF4B7] transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Team Members</h2>
                                <button
                                    onClick={() => setEditingMember({ name: '', role: '', image: '' })}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#008f7d] text-white rounded-xl hover:bg-[#00a08d] transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Member
                                </button>
                            </div>

                            {/* Member Form Modal */}
                            {editingMember && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="w-full max-w-lg bg-[#002420] rounded-2xl border border-[#008f7d]/30 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white">{editingMember.id ? 'Edit' : 'Add'} Member</h3>
                                            <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white">
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={editingMember.name || ''}
                                                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Role"
                                                value={editingMember.role || ''}
                                                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <ImageUpload
                                                value={editingMember.image || ''}
                                                onChange={(img) => setEditingMember({ ...editingMember, image: img })}
                                                resolution="200x200px"
                                                aspectRatio="1:1"
                                                maxSize={500}
                                            />
                                            <button
                                                onClick={saveMember}
                                                disabled={loading}
                                                className="w-full py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Save className="w-4 h-4" /> Save Member
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Members List */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {members.map((member) => (
                                    <div key={member.id} className="p-4 bg-[#002420] rounded-xl border border-[#008f7d]/30">
                                        <div className="flex items-center gap-4 mb-3">
                                            {member.image && (
                                                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-white">{member.name}</h3>
                                                <p className="text-sm text-[#008f7d]">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setEditingMember(member)}
                                                className="p-2 text-[#FFF4B7]/60 hover:text-[#FFF4B7] transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteMember(member.id)}
                                                className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Services</h2>
                            </div>

                            {/* Service Form Modal */}
                            {editingService && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="w-full max-w-lg bg-[#002420] rounded-2xl border border-[#008f7d]/30 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white">{editingService.id ? 'Edit' : 'Add'} Service</h3>
                                            <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-white">
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {!editingService.id && (
                                                <select
                                                    value={editingService.categoryId || ''}
                                                    onChange={(e) => setEditingService({ ...editingService, categoryId: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                                >
                                                    <option value="">Select Category</option>
                                                    {services?.categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                                    ))}
                                                </select>
                                            )}
                                            <input
                                                type="text"
                                                placeholder="Service Title"
                                                value={editingService.title || ''}
                                                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                rows={3}
                                                value={editingService.description || ''}
                                                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d] resize-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Icon (e.g., Globe, Rocket, Brain)"
                                                value={editingService.icon || ''}
                                                onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#001210] border border-[#008f7d]/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#008f7d]"
                                            />
                                            <label className="flex items-center gap-2 text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={editingService.featured || false}
                                                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                                                    className="rounded"
                                                />
                                                Featured service
                                            </label>
                                            <button
                                                onClick={saveService}
                                                disabled={loading}
                                                className="w-full py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <Save className="w-4 h-4" /> Save Service
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Services by Category */}
                            {services?.categories.map((category) => (
                                <div key={category.id} className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#FFF4B7]">{category.title}</h3>
                                            <p className="text-sm text-gray-400">{category.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setEditingService({ categoryId: category.id, title: '', description: '', icon: 'Globe' })}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#008f7d]/20 text-[#008f7d] text-sm rounded-lg hover:bg-[#008f7d]/30 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                    <div className="grid gap-3">
                                        {category.services.map((service) => (
                                            <div key={service.id} className="p-3 bg-[#002420] rounded-lg border border-[#008f7d]/20 flex items-center justify-between">
                                                <div>
                                                    <span className="font-medium text-white">{service.title}</span>
                                                    {service.featured && <span className="ml-2 text-xs text-[#FFF4B7]/60 bg-[#FFF4B7]/10 px-2 py-0.5 rounded">Featured</span>}
                                                    <p className="text-sm text-gray-400 truncate max-w-md">{service.description}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingService({ ...service, categoryId: category.id })}
                                                        className="p-1.5 text-[#FFF4B7]/60 hover:text-[#FFF4B7] transition-colors"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteService(service.id)}
                                                        className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hero Tab */}
                    {activeTab === 'hero' && hero && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Hero Section</h2>
                            <div className="max-w-2xl space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Headline 1</label>
                                        <input
                                            type="text"
                                            value={hero.headline1}
                                            onChange={(e) => setHero({ ...hero, headline1: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Headline 2</label>
                                        <input
                                            type="text"
                                            value={hero.headline2}
                                            onChange={(e) => setHero({ ...hero, headline2: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={hero.description}
                                        onChange={(e) => setHero({ ...hero, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d] resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Primary CTA Text</label>
                                        <input
                                            type="text"
                                            value={hero.primaryCta.text}
                                            onChange={(e) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, text: e.target.value } })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Primary CTA Link</label>
                                        <input
                                            type="text"
                                            value={hero.primaryCta.href}
                                            onChange={(e) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, href: e.target.value } })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Secondary CTA Text</label>
                                        <input
                                            type="text"
                                            value={hero.secondaryCta.text}
                                            onChange={(e) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, text: e.target.value } })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Secondary CTA Link</label>
                                        <input
                                            type="text"
                                            value={hero.secondaryCta.href}
                                            onChange={(e) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, href: e.target.value } })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={saveHero}
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && about && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">About Section</h2>
                            <div className="max-w-2xl space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Label</label>
                                        <input
                                            type="text"
                                            value={about.label}
                                            onChange={(e) => setAbout({ ...about, label: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={about.title}
                                            onChange={(e) => setAbout({ ...about, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title Highlight</label>
                                    <input
                                        type="text"
                                        value={about.titleHighlight}
                                        onChange={(e) => setAbout({ ...about, titleHighlight: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Paragraphs (one per line)</label>
                                    <textarea
                                        rows={6}
                                        value={about.paragraphs.join('\n\n')}
                                        onChange={(e) => setAbout({ ...about, paragraphs: e.target.value.split('\n\n').filter(Boolean) })}
                                        className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d] resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Graphic Text</label>
                                        <input
                                            type="text"
                                            value={about.graphicText}
                                            onChange={(e) => setAbout({ ...about, graphicText: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Graphic Subtext</label>
                                        <input
                                            type="text"
                                            value={about.graphicSubtext}
                                            onChange={(e) => setAbout({ ...about, graphicSubtext: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#002420] border border-[#008f7d]/30 rounded-xl text-white focus:outline-none focus:border-[#008f7d]"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={saveAbout}
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#008f7d] text-white font-semibold rounded-xl hover:bg-[#00a08d] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
