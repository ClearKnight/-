import { useState } from 'react'
import type { LatLng, Restaurant } from '../../types'
import './AddRestaurantModal.css'

interface AddRestaurantModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (restaurant: Omit<Restaurant, 'id' | 'reviewCount' | 'scores' | 'tagsSummary' | 'nearbySchools'>) => void
  initialLocation: LatLng
}

export function AddRestaurantModal({ open, onClose, onSubmit, initialLocation }: AddRestaurantModalProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [avgPrice, setAvgPrice] = useState<number>(25)
  const [categories, setCategories] = useState('')

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address) return

    onSubmit({
      name,
      address,
      avgPricePerPerson: avgPrice,
      categories: categories.split(/[，,]/).map(c => c.trim()).filter(Boolean),
      location: initialLocation,
    })
    
    // Reset form
    setName('')
    setAddress('')
    setAvgPrice(25)
    setCategories('')
    onClose()
  }

  return (
    <div className="ufm-modal-overlay">
      <div className="ufm-modal-content">
        <header className="ufm-modal-header">
          <h3>新增宝藏店铺 🍲</h3>
          <button type="button" className="ufm-modal-close" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit} className="ufm-modal-form">
          <div className="ufm-form-group">
            <label>店铺名称</label>
            <input 
              required 
              placeholder="如：后街无名炸串" 
              value={name} 
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="ufm-form-group">
            <label>详细地址</label>
            <input 
              required 
              placeholder="如：平山村 22 号仓库旁" 
              value={address} 
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="ufm-form-row">
            <div className="ufm-form-group">
              <label>人均价格 (¥)</label>
              <input 
                type="number" 
                value={avgPrice} 
                onChange={e => setAvgPrice(Number(e.target.value))}
              />
            </div>
            <div className="ufm-form-group">
              <label>分类 (用逗号分隔)</label>
              <input 
                placeholder="如：小吃, 夜宵" 
                value={categories} 
                onChange={e => setCategories(e.target.value)}
              />
            </div>
          </div>
          <div className="ufm-location-preview">
            <span>📍 已在地图标记位置</span>
            <small>({initialLocation.lat.toFixed(4)}, {initialLocation.lng.toFixed(4)})</small>
          </div>
          <div className="ufm-modal-actions">
            <button type="button" className="ufm-btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="ufm-btn-primary">确认添加</button>
          </div>
        </form>
      </div>
    </div>
  )
}
