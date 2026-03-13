import type { Restaurant } from '../../types'
import './RestaurantList.css'
import { RestaurantCard } from './RestaurantCard'

interface RestaurantListProps {
  restaurants: Restaurant[]
  onSelect: (restaurantId: string) => void
  activeSchoolId: string
}

export function RestaurantList({ restaurants, onSelect, activeSchoolId }: RestaurantListProps) {
  if (!restaurants.length) {
    return <div className="ufm-rest-empty">当前条件下暂无餐厅，试试放宽筛选条件。</div>
  }

  return (
    <div className="ufm-rest-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => onSelect(restaurant.id)}
          activeSchoolId={activeSchoolId}
        />
      ))}
    </div>
  )
}

