import { useState } from 'react'
import type { Restaurant, Review, SchoolId } from '../../types'
import './ReviewForm.css'

interface ReviewFormProps {
  restaurant: Restaurant
  schoolId: SchoolId
  onSubmit: (review: Review) => void
}

export function ReviewForm({ restaurant, schoolId, onSubmit }: ReviewFormProps) {
  const [overall, setOverall] = useState(4.5)
  const [content, setContent] = useState('')
  const [recommend, setRecommend] = useState('')

  const handleSubmit = () => {
    const now = new Date().toISOString()
    const finalContent = recommend 
      ? `${content}\n\n🌟 推荐菜：${recommend}`
      : content

    const review: Review = {
      id: `local-${now}`,
      restaurantId: restaurant.id,
      schoolId,
      authorNickname: '匿名同学',
      scores: {
        overall,
        taste: overall,
        environment: overall,
        value: overall,
      },
      tags: [],
      content: finalContent.trim() || undefined,
      createdAt: now,
      upvoteCount: 0,
    }
    onSubmit(review)
    setContent('')
    setRecommend('')
  }

  return (
    <div className="ufm-review-form">
      <div className="ufm-review-form-row">
        <label className="ufm-review-form-label">
          整体评分
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={overall}
            onChange={(e) => setOverall(Number(e.target.value))}
            className="ufm-review-form-score-input"
          />
        </label>
      </div>
      <div className="ufm-form-group" style={{ marginBottom: '8px' }}>
        <input 
          placeholder="推荐菜？（如：避风塘炒蟹、招牌奶茶）" 
          value={recommend}
          onChange={e => setRecommend(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
        />
      </div>
      <textarea
        className="ufm-review-form-textarea"
        placeholder="写下你的真实评价..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="ufm-review-form-actions">
        <button
          type="button"
          className="ufm-review-form-submit"
          onClick={handleSubmit}
          disabled={!overall}
        >
          提交评价（本地保存）
        </button>
      </div>
    </div>
  )
}

