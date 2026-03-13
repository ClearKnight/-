import type { Restaurant, Review, SchoolId } from '../../types'
import './RestaurantDetailDrawer.css'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'

interface RestaurantDetailDrawerProps {
  restaurant: Restaurant | null
  open: boolean
  onClose: () => void
  reviews: Review[]
  schoolId: SchoolId
  onAddReview: (review: Review) => void
}

export function RestaurantDetailDrawer({
  restaurant,
  open,
  onClose,
  reviews,
  schoolId,
  onAddReview,
}: RestaurantDetailDrawerProps) {
  if (!restaurant) return null

  return (
    <div className={open ? 'ufm-drawer ufm-drawer-open' : 'ufm-drawer'}>
      <div className="ufm-drawer-backdrop" onClick={onClose} />
      <section className="ufm-drawer-panel">
        <header className="ufm-drawer-header">
          <div>
            <div className="ufm-drawer-name">{restaurant.name}</div>
            <div className="ufm-drawer-meta">
              <span className="ufm-drawer-score">
                {restaurant.scores.overall.toFixed(1)} 分
              </span>
              <span className="ufm-drawer-meta-dot">·</span>
              <span>{restaurant.reviewCount} 条评价</span>
              <span className="ufm-drawer-meta-dot">·</span>
              <span>人均 ¥{restaurant.avgPricePerPerson}</span>
            </div>
          </div>
          <button type="button" className="ufm-drawer-close" onClick={onClose}>
            关闭
          </button>
        </header>

        <div className="ufm-drawer-body">
          {restaurant.imageUrl && (
            <div className="ufm-drawer-hero">
              <img src={restaurant.imageUrl} alt={restaurant.name} className="ufm-drawer-img" />
            </div>
          )}
          <div className="ufm-drawer-section">
            <div className="ufm-drawer-section-title">综合评分</div>
            <div className="ufm-drawer-scores">
              <div>
                <div className="ufm-drawer-score-main">
                  {restaurant.scores.overall.toFixed(1)}
                </div>
                <div className="ufm-drawer-score-label">综合</div>
              </div>
              <div className="ufm-drawer-score-mini">
                <span>口味 {restaurant.scores.taste.toFixed(1)}</span>
                <span>环境 {restaurant.scores.environment.toFixed(1)}</span>
                <span>性价比 {restaurant.scores.value.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="ufm-drawer-section">
            <div className="ufm-drawer-section-title">学生高频标签</div>
            <div className="ufm-drawer-tags">
              {restaurant.tagsSummary.map((tag) => (
                <span key={tag.tagId} className="ufm-drawer-tag">
                  {tag.tagName}
                  <span className="ufm-drawer-tag-count">{tag.count}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="ufm-drawer-section">
            <div className="ufm-drawer-section-title">地址</div>
            <div className="ufm-drawer-address">{restaurant.address}</div>
          </div>

          <div className="ufm-drawer-section">
            <div className="ufm-drawer-section-title">学生评价</div>
            <ReviewForm restaurant={restaurant} schoolId={schoolId} onSubmit={onAddReview} />
            <div className="ufm-drawer-section-subtitle">最近评价</div>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </section>
    </div>
  )
}

