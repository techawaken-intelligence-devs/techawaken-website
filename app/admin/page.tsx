'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react'

interface Position {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  status: 'active' | 'draft' | 'closed'
  createdAt: string
  updatedAt: string
}

interface Application {
  id: string
  positionId: string
  positionTitle: string
  fullName: string
  email: string
  phone: string
  portfolioUrl?: string
  linkedinUrl?: string
  coverNote?: string
  resumeUrl?: string
  status: 'new' | 'reviewed' | 'interviewing' | 'rejected' | 'accepted'
  createdAt: string
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Data states
  const [activeTab, setActiveTab] = useState<'positions' | 'applications'>('positions')
  const [positions, setPositions] = useState<Position[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Position modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Rajkot, Gujarat (Hybrid / Remote)',
    type: 'Full-time',
    experience: '2-4 Years',
    salary: 'Competitive / Industry Standard',
    description: '',
    requirements: '',
    responsibilities: '',
    status: 'active' as 'active' | 'draft' | 'closed'
  })

  // Backend API URL
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  }

  useEffect(() => {
    const savedToken = localStorage.getItem('ta_admin_token')
    if (savedToken) {
      setToken(savedToken)
      fetchData(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setLoading(true)

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('ta_admin_token', data.token)
        setToken(data.token)
        fetchData(data.token)
      } else {
        setAuthError(data.error || 'Invalid credentials')
        setLoading(false)
      }
    } catch (err) {
      // If local server is not running, provide helpful notice
      setAuthError('Could not reach backend API at ' + getApiUrl() + '. Ensure the server is running on port 5000.')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ta_admin_token')
    setToken(null)
    setPositions([])
    setApplications([])
  }

  const fetchData = async (authToken: string) => {
    setIsRefreshing(true)
    try {
      const [posRes, appRes] = await Promise.all([
        fetch(`${getApiUrl()}/api/admin/positions`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch(`${getApiUrl()}/api/admin/applications`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ])

      if (posRes.ok) {
        const posData = await posRes.json()
        setPositions(posData.data || [])
      }

      if (appRes.ok) {
        const appData = await appRes.json()
        setApplications(appData.data || [])
      }
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const openCreateModal = () => {
    setEditingPosition(null)
    setFormData({
      title: '',
      department: 'Engineering',
      location: 'Rajkot, Gujarat (Hybrid / Remote)',
      type: 'Full-time',
      experience: '2-4 Years',
      salary: 'Competitive / Industry Standard',
      description: '',
      requirements: '',
      responsibilities: '',
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const openEditModal = (pos: Position) => {
    setEditingPosition(pos)
    setFormData({
      title: pos.title,
      department: pos.department,
      location: pos.location,
      type: pos.type,
      experience: pos.experience,
      salary: pos.salary,
      description: pos.description,
      requirements: pos.requirements.join('\n'),
      responsibilities: pos.responsibilities.join('\n'),
      status: pos.status
    })
    setIsModalOpen(true)
  }

  const handleSavePosition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    const payload = {
      ...formData,
      requirements: formData.requirements
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: formData.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    try {
      if (editingPosition) {
        // Update
        const res = await fetch(`${getApiUrl()}/api/admin/positions/${editingPosition.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          setIsModalOpen(false)
          fetchData(token)
        }
      } else {
        // Create
        const res = await fetch(`${getApiUrl()}/api/admin/positions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          setIsModalOpen(false)
          fetchData(token)
        }
      }
    } catch (err) {
      console.error('Error saving position:', err)
    }
  }

  const handleDeletePosition = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this position?')) return

    try {
      const res = await fetch(`${getApiUrl()}/api/admin/positions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        fetchData(token)
      }
    } catch (err) {
      console.error('Error deleting position:', err)
    }
  }

  const handleUpdateApplicationStatus = async (id: string, newStatus: Application['status']) => {
    if (!token) return

    try {
      const res = await fetch(`${getApiUrl()}/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchData(token)
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const filteredPositions = positions.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredApplications = applications.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 1. LOGIN SCREEN
  if (!token) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#f2f1ec] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md border border-[rgba(242,241,236,0.12)] bg-[#0d0d0c] p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffd21f]" />
          
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#8d8c86] hover:text-[#ffd21f] transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to TechAwaken
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ffd21f]" />
              <h1 className="font-mono text-sm tracking-widest uppercase text-[#8d8c86]">Admin Portal</h1>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#f2f1ec] mt-1 font-display">
              Content & Careers Engine
            </h2>
            <p className="text-xs text-[#8d8c86] mt-1 font-mono">
              Manage live job postings, candidates, and dynamic platform content.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8d8c86] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#141413] border border-[rgba(242,241,236,0.15)] px-3.5 py-2.5 text-sm text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8d8c86] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141413] border border-[rgba(242,241,236,0.15)] px-3.5 py-2.5 text-sm text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffd21f] text-[#070707] py-2.5 text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#ffe066] transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(242,241,236,0.08)] flex justify-between items-center text-[11px] font-mono text-[#8d8c86]">
            <span>Initial Default: admin</span>
            <span>TechAwaken@2026</span>
          </div>
        </div>
      </main>
    )
  }

  // 2. DASHBOARD SCREEN
  return (
    <main className="min-h-screen bg-[#070707] text-[#f2f1ec]">
      {/* Top Header */}
      <header className="border-b border-[rgba(242,241,236,0.1)] bg-[#0d0d0c] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-3 bg-[#ffd21f]" />
              <span className="font-display font-bold tracking-tight text-lg group-hover:text-[#ffd21f] transition-colors">
                TechAwaken
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#171716] text-[#ffd21f] border border-[#ffd21f]/30">
                ADMIN
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1 text-xs font-mono text-[#8d8c86]">
              <span>API:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => token && fetchData(token)}
              disabled={isRefreshing}
              className="p-2 border border-[rgba(242,241,236,0.1)] hover:border-[#ffd21f] text-[#8d8c86] hover:text-[#ffd21f] transition-colors text-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/#careers"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[rgba(242,241,236,0.15)] text-xs font-mono text-[#f2f1ec] hover:text-[#ffd21f] hover:border-[#ffd21f] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171716] border border-[rgba(242,241,236,0.15)] hover:border-red-500/50 hover:text-red-400 text-xs font-mono text-[#8d8c86] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] p-5">
            <span className="text-xs font-mono text-[#8d8c86] uppercase tracking-wider block">Total Postings</span>
            <span className="text-3xl font-display font-bold text-[#f2f1ec] mt-1 block">{positions.length}</span>
            <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
              {positions.filter((p) => p.status === 'active').length} Active Live
            </span>
          </div>

          <div className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] p-5">
            <span className="text-xs font-mono text-[#8d8c86] uppercase tracking-wider block">Applications</span>
            <span className="text-3xl font-display font-bold text-[#ffd21f] mt-1 block">{applications.length}</span>
            <span className="text-[11px] font-mono text-[#8d8c86] mt-2 block">
              {applications.filter((a) => a.status === 'new').length} New submissions
            </span>
          </div>

          <div className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] p-5">
            <span className="text-xs font-mono text-[#8d8c86] uppercase tracking-wider block">Database Mode</span>
            <span className="text-xl font-display font-bold text-[#f2f1ec] mt-1 block">Aiven / Local</span>
            <span className="text-[11px] font-mono text-[#8d8c86] mt-2 block">PostgreSQL Ready</span>
          </div>

          <div className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] p-5">
            <span className="text-xs font-mono text-[#8d8c86] uppercase tracking-wider block">Hosting Target</span>
            <span className="text-xl font-display font-bold text-[#f2f1ec] mt-1 block">Render / Vercel</span>
            <span className="text-[11px] font-mono text-[#8d8c86] mt-2 block">techawakenintelligence.com</span>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(242,241,236,0.1)] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('positions')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'positions'
                  ? 'bg-[#ffd21f] text-[#070707] font-bold'
                  : 'bg-[#141413] text-[#8d8c86] hover:text-[#f2f1ec]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Open Positions ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === 'applications'
                  ? 'bg-[#ffd21f] text-[#070707] font-bold'
                  : 'bg-[#141413] text-[#8d8c86] hover:text-[#f2f1ec]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Candidates ({applications.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8d8c86]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121211] border border-[rgba(242,241,236,0.12)] pl-9 pr-3 py-1.5 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
              />
            </div>

            {activeTab === 'positions' && (
              <button
                onClick={openCreateModal}
                className="px-3.5 py-1.5 bg-[#ffd21f] text-[#070707] text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#ffe066] transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> New Position
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: POSITIONS LIST */}
        {activeTab === 'positions' && (
          <div className="space-y-3">
            {filteredPositions.length === 0 ? (
              <div className="border border-dashed border-[rgba(242,241,236,0.15)] p-12 text-center">
                <Briefcase className="w-8 h-8 text-[#8d8c86] mx-auto mb-3" />
                <p className="text-sm font-mono text-[#8d8c86]">No positions found</p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 px-4 py-2 bg-[#ffd21f] text-[#070707] text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Create First Position
                </button>
              </div>
            ) : (
              filteredPositions.map((pos) => (
                <div
                  key={pos.id}
                  className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] hover:border-[rgba(242,241,236,0.2)] p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-[#f2f1ec]">{pos.title}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 border ${
                          pos.status === 'active'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                            : pos.status === 'draft'
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                            : 'bg-red-950/40 border-red-500/30 text-red-400'
                        }`}
                      >
                        {pos.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#8d8c86]">
                      <span>{pos.department}</span>
                      <span>·</span>
                      <span>{pos.location}</span>
                      <span>·</span>
                      <span>{pos.type}</span>
                      <span>·</span>
                      <span className="text-[#ffd21f]">{pos.salary}</span>
                    </div>

                    <p className="text-xs text-[#b8b7b2] line-clamp-1 max-w-2xl">{pos.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[rgba(242,241,236,0.08)]">
                    <button
                      onClick={() => openEditModal(pos)}
                      className="p-2 bg-[#171716] border border-[rgba(242,241,236,0.12)] hover:border-[#ffd21f] text-[#8d8c86] hover:text-[#ffd21f] transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePosition(pos.id)}
                      className="p-2 bg-[#171716] border border-[rgba(242,241,236,0.12)] hover:border-red-500/50 text-[#8d8c86] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: APPLICATIONS LIST */}
        {activeTab === 'applications' && (
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <div className="border border-dashed border-[rgba(242,241,236,0.15)] p-12 text-center">
                <Users className="w-8 h-8 text-[#8d8c86] mx-auto mb-3" />
                <p className="text-sm font-mono text-[#8d8c86]">No job applications received yet</p>
                <p className="text-xs font-mono text-[#5f5e59] mt-1">Applications submitted via the Careers section appear here.</p>
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#0e0e0d] border border-[rgba(242,241,236,0.08)] hover:border-[rgba(242,241,236,0.2)] p-5 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-[#f2f1ec]">{app.fullName}</span>
                      <span className="text-xs font-mono text-[#ffd21f] px-2 py-0.5 bg-[#ffd21f]/10 border border-[#ffd21f]/20">
                        {app.positionTitle}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#8d8c86]">
                      <span>Email: <a href={`mailto:${app.email}`} className="text-[#f2f1ec] underline">{app.email}</a></span>
                      <span>·</span>
                      <span>Phone: <a href={`tel:${app.phone}`} className="text-[#f2f1ec]">{app.phone}</a></span>
                      <span>·</span>
                      <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    {app.coverNote && (
                      <p className="text-xs text-[#b8b7b2] bg-[#141413] p-3 border border-[rgba(242,241,236,0.05)]">
                        &quot;{app.coverNote}&quot;
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#ffd21f] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Portfolio
                        </a>
                      )}
                      {app.linkedinUrl && (
                        <a
                          href={app.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#ffd21f] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> LinkedIn Profile
                        </a>
                      )}
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#ffd21f] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Resume Link
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#8d8c86]">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as Application['status'])}
                      className="bg-[#171716] border border-[rgba(242,241,236,0.15)] text-xs font-mono text-[#f2f1ec] px-2.5 py-1 focus:outline-none focus:border-[#ffd21f]"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT POSITION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0e0e0d] border border-[rgba(242,241,236,0.15)] p-6 my-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-[rgba(242,241,236,0.1)] pb-4">
              <div>
                <h3 className="text-xl font-display font-bold text-[#f2f1ec]">
                  {editingPosition ? 'Edit Job Posting' : 'Create New Open Position'}
                </h3>
                <p className="text-xs font-mono text-[#8d8c86] mt-0.5">
                  Publish to the TechAwaken live careers section
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8d8c86] hover:text-[#f2f1ec] text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePosition} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI Solutions">AI Solutions</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                    placeholder="e.g. Rajkot, Gujarat (Hybrid)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                    placeholder="e.g. 3-5 Years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Compensation / Salary</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                    placeholder="e.g. Competitive / Based on experience"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8d8c86] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  >
                    <option value="active">Active (Visible to public)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8d8c86] mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  placeholder="Overview of the role..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8d8c86] mb-1">
                  Key Requirements (One bullet point per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  placeholder="Strong proficiency in Next.js & Node.js&#10;Experience with PostgreSQL & Cloud..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8d8c86] mb-1">
                  Responsibilities (One bullet point per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className="w-full bg-[#171716] border border-[rgba(242,241,236,0.12)] px-3 py-2 text-xs text-[#f2f1ec] focus:outline-none focus:border-[#ffd21f] font-mono"
                  placeholder="Architect and deploy scalable APIs&#10;Work closely with AI researchers..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(242,241,236,0.1)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[rgba(242,241,236,0.15)] text-xs font-mono text-[#8d8c86] hover:text-[#f2f1ec]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffd21f] text-[#070707] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffe066]"
                >
                  {editingPosition ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
