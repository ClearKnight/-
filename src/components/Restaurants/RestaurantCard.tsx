import type { Restaurant } from '../../types'
import './RestaurantCard.css'

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
  activeSchoolId?: string
}

export function RestaurantCard({ restaurant, onClick, activeSchoolId }: RestaurantCardProps) {
  const schoolRef = activeSchoolId
    ? restaurant.nearbySchools.find((s) => s.schoolId === activeSchoolId)
    : null

  return (
    <button type="button" className="ufm-rest-card" onClick={onClick}>
      <div className="ufm-rest-card-main">
        {restaurant.imageUrl && (
          <div className="ufm-rest-img-wrapper">
            <img src={restaurant.imageUrl} alt={restaurant.name} className="ufm-rest-img" />
          </div>
        )}
        <div className="ufm-rest-info">
          <div className="ufm-rest-name-row">
            <span className="ufm-rest-name">{restaurant.name}</span>
          </div>
          <div className="ufm-rest-meta">
            <span className="ufm-rest-score">
              {restaurant.scores.overall.toFixed(1)}
              <span className="ufm-rest-score-sub">分</span>
            </span>
            <span className="ufm-rest-review-count">{restaurant.reviewCount} 条评价</span>
            <span className="ufm-rest-price">人均 ¥{restaurant.avgPricePerPerson}</span>
          </div>
          {schoolRef && (
            <div className="ufm-rest-distance-row">
              📍 {schoolRef.distanceMeters}m / {schoolRef.walkingMinutes}min
            </div>
          )}
          <div className="ufm-rest-tags">
            {restaurant.tagsSummary.slice(0, 3).map((tag) => (
              <span key={tag.tagId} className="ufm-rest-tag">
                {tag.tagName}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="ufm-rest-address">{restaurant.address}</div>
    </button>
  )
}

