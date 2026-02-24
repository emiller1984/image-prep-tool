import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPresets, publishPresets } from '../../services/presetService'
import defaultPresets from '../../config/presets'
import PresetList from './PresetList'
import PresetForm from './PresetForm'

export default function AdminPage() {
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingPreset, setEditingPreset] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    fetchPresets()
      .then(items => {
        setPresets(items && items.length > 0 ? items : defaultPresets)
        setLoading(false)
      })
      .catch(() => {
        setPresets(defaultPresets)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => setSaveStatus(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  const handlePublish = async () => {
    setSaving(true)
    setSaveStatus(null)
    try {
      await publishPresets(presets)
      setHasChanges(false)
      setSaveStatus({ type: 'success', message: 'Presets published successfully.' })
    } catch {
      setSaveStatus({ type: 'error', message: 'Failed to publish. Please try again.' })
    }
    setSaving(false)
  }

  const handleAdd = () => {
    setEditingPreset(null)
    setIsAdding(true)
  }

  const handleEdit = (preset) => {
    setIsAdding(false)
    setEditingPreset(preset)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this preset?')) return
    setPresets(prev => prev.filter(p => p.id !== id))
    setHasChanges(true)
  }

  const handleSave = (preset) => {
    if (isAdding) {
      setPresets(prev => [...prev, preset])
    } else {
      setPresets(prev => prev.map(p => p.id === preset.id ? preset : p))
    }
    setEditingPreset(null)
    setIsAdding(false)
    setHasChanges(true)
  }

  const handleCancel = () => {
    setEditingPreset(null)
    setIsAdding(false)
  }

  const showForm = isAdding || editingPreset

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[760px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[26px] font-bold text-text-primary">
            Manage Presets
          </h1>
          <Link
            to="/"
            className="text-sm text-primary hover:text-blue-600 transition-colors"
          >
            &larr; Back to App
          </Link>
        </div>
        <p className="text-sm text-text-muted mb-6">
          Add, edit, or remove image size presets. Publish to make changes live.
        </p>

        {/* Status banner */}
        {saveStatus && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            saveStatus.type === 'success'
              ? 'bg-success-light border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-error'
          }`}>
            {saveStatus.message}
          </div>
        )}

        {/* Main content */}
        <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
          {loading ? (
            <div className="text-sm text-text-muted text-center py-8">Loading presets...</div>
          ) : showForm ? (
            <PresetForm
              preset={editingPreset}
              existingIds={presets.map(p => p.id)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <PresetList
              presets={presets}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </div>

        {/* Publish bar */}
        {!loading && !showForm && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-text-faint">
              {hasChanges ? 'You have unpublished changes' : 'All changes published'}
            </div>
            <button
              onClick={handlePublish}
              disabled={saving || !hasChanges}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                saving || !hasChanges
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-600'
              }`}
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
