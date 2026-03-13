import type { ChangeEvent } from 'react'
import './FilterPanel.css'

export interface FilterState {
  minScore: number
  priceRange: 'all' | '0-20' | '20-40' | '40+'
  activeTagIds: string[]
}

interface FilterPanelProps {
  value: FilterState
  onChange: (next: FilterState) => void
}

const quickTags = [
  { id: 'late_night', name: '深夜食堂', icon: '🌙' },
  { id: 'budget', name: '平价之选', icon: '💰' },
  { id: 'study_friendly', name: '自习推荐', icon: '📖' },
  { id: 'group_dining', name: '聚餐必备', icon: '👥' },
]

export function FilterPanel({ value, onChange }: FilterPanelProps) {
  const handleScoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, minScore: Number(e.target.value) })
  }

  const handlePriceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, priceRange: e.target.value as FilterState['priceRange'] })
  }

  const toggleTag = (tagId: string) => {
    const nextTags = value.activeTagIds.includes(tagId)
      ? value.activeTagIds.filter((id) => id !== tagId)
      : [...value.activeTagIds, tagId]
    onChange({ ...value, activeTagIds: nextTags })
  }

  return (
    <div className="ufm-filter-panel">
      <div className="ufm-filter-row">
        <div className="ufm-quick-filters">
          {quickTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`ufm-tag-btn ${value.activeTagIds.includes(tag.id) ? 'active' : ''}`}
              onClick={() => toggleTag(tag.id)}
            >
              <span className="ufm-tag-icon">{tag.icon}</span>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <div className="ufm-filter-grid">
        <div className="ufm-filter-item">
          <label className="ufm-filter-label">评分不低于</label>
          <select
            className="ufm-filter-select"
            value={value.minScore}
            onChange={handleScoreChange}
          >
            <option value={0}>不限</option>
            <option value={3.5}>3.5 分</option>
            <option value={4}>4.0 分</option>
            <option value={4.5}>4.5 分</option>
          </select>
        </div>
        <div className="ufm-filter-item">
          <label className="ufm-filter-label">人均价格</label>
          <select
            className="ufm-filter-select"
            value={value.priceRange}
            onChange={handlePriceChange}
          >
            <option value="all">不限</option>
            <option value="0-20">¥0-20</option>
            <option value="20-40">¥20-40</option>
            <option value="40+">¥40 以上</option>
          </select>
        </div>
      </div>
    </div>
  )
}

