import type { Review, Restaurant } from '../../types'
import './ReviewList.css'

interface ReviewListProps {
  reviews: Review[]
  restaurants?: Restaurant[]
  onSelectRestaurant?: (id: string) => void
}

export function ReviewList({ reviews, restaurants, onSelectRestaurant }: ReviewListProps) {
  if (!reviews.length) {
    return <div className="ufm-review-empty">还没有学生评价，欢迎成为第一个打分的人。</div>
  }

  return (
    <ul className="ufm-review-list">
      {reviews.map((review) => {
        const restaurant = restaurants?.find((r) => r.id === review.restaurantId)
        return (
          <li key={review.id} className="ufm-review-item">
            <div className="ufm-review-header">
              <div className="ufm-review-user-info">
                <span className="ufm-review-author">{review.authorNickname}</span>
                {restaurant && (
                  <button
                    type="button"
                    className="ufm-review-rest-link"
                    onClick={() => onSelectRestaurant?.(restaurant.id)}
                  >
                    @ {restaurant.name}
                  </button>
                )}
              </div>
              <span className="ufm-review-score">{review.scores.overall.toFixed(1)} 分</span>
            </div>
            <div className="ufm-review-tags">
              {review.tags.map((tag) => (
                <span key={tag} className="ufm-review-tag">
                  {tag}
                </span>
              ))}
            </div>
            {review.content && <p className="ufm-review-content">{review.content}</p>}
            {review.images && review.images.length > 0 && (
              <div className="ufm-review-imgs">
                {review.images.map((img, idx) => (
                  <img key={idx} src={img} alt="评价图片" className="ufm-review-img" />
                ))}
              </div>
            )}
            <div className="ufm-review-footer">
              <span className="ufm-review-time">
                {new Date(review.createdAt).toLocaleString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <button type="button" className="ufm-review-upvote-btn">
                👍 {review.upvoteCount > 0 ? review.upvoteCount : '有用'}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

