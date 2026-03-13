import './MapPage.css'
import { useEffect, useMemo, useState } from 'react'
import { AmapContainer } from '../components/Map/AmapContainer'
import { SchoolSelector } from '../components/Filters/SchoolSelector'
import { FilterPanel } from '../components/Filters/FilterPanel'
import type { FilterState } from '../components/Filters/FilterPanel'
import { restaurants, reviews as initialReviews, schools } from '../mock/data'
import type { LatLng, Restaurant, Review } from '../types'
import { RestaurantList } from '../components/Restaurants/RestaurantList'
import { RestaurantDetailDrawer } from '../components/Restaurants/RestaurantDetailDrawer'
import { ReviewList } from '../components/Restaurants/ReviewList'
import { distanceInMeters, filterRestaurants, sortRestaurants } from '../utils/restaurantFilters'

import { AddRestaurantModal } from '../components/Restaurants/AddRestaurantModal'

export function MapPage() {
  const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>(restaurants)
  const [activeSchoolId, setActiveSchoolId] = useState<string>(schools[0]?.id ?? '')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [clickedLocation, setClickedLocation] = useState<LatLng | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [activeTab, setActiveTab] = useState<'restaurants' | 'forum'>('restaurants')
  const [filters, setFilters] = useState<FilterState>({
    minScore: 0,
    priceRange: 'all',
    activeTagIds: [],
  })
  const [reviewsByRestaurant, setReviewsByRestaurant] = useState<Record<string, Review[]>>(() => {
    const grouped: Record<string, Review[]> = {}
    for (const r of initialReviews) {
      if (!grouped[r.restaurantId]) grouped[r.restaurantId] = []
      grouped[r.restaurantId].push(r)
    }
    return grouped
  })

  const globalReviews = useMemo(() => {
    return Object.values(reviewsByRestaurant)
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reviewsByRestaurant])

  const activeSchool = useMemo(
    () => schools.find((s) => s.id === activeSchoolId) ?? schools[0],
    [activeSchoolId],
  )

  const [mapCenter, setMapCenter] = useState<LatLng>(activeSchool.location)
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

  useEffect(() => {
    if (!navigator.geolocation || !('permissions' in navigator)) return

    ;(navigator as any).permissions
      .query({ name: 'geolocation' })
      .then((result: PermissionStatus) => {
        if (result.state !== 'granted') return

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }
            setCurrentLocation(loc)
            setMapCenter(loc)
          },
          () => {
            // 已授权但定位失败时保持默认中心
          },
          { enableHighAccuracy: true, timeout: 10000 },
        )
      })
      .catch(() => {
        // 某些浏览器可能不支持权限查询，忽略即可
      })
  }, [])

  useEffect(() => {
    setMapCenter(activeSchool.location)
  }, [activeSchool])

  const visibleRestaurants = useMemo(() => {
    let filtered = filterRestaurants(restaurantsList, filters)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) || r.categories.some((c) => c.includes(query)),
      )
    }
    return sortRestaurants(filtered, 'composite', activeSchool.id)
  }, [filters, activeSchool.id, searchQuery, restaurantsList])

  const mapPoints = useMemo(() => {
    return visibleRestaurants.map((r) => ({
      id: r.id,
      name: r.name,
      location: r.location,
    }))
  }, [visibleRestaurants])

  useEffect(() => {
    if (selectedRestaurant) {
      setMapCenter(selectedRestaurant.location)
    }
  }, [selectedRestaurant])

  const handleAddRestaurant = (data: Omit<Restaurant, 'id' | 'reviewCount' | 'scores' | 'tagsSummary' | 'nearbySchools'>) => {
    const newRestaurant: Restaurant = {
      ...data,
      id: `custom-${Date.now()}`,
      reviewCount: 0,
      scores: { overall: 0, taste: 0, environment: 0, value: 0 },
      tagsSummary: [],
      nearbySchools: schools.map(s => ({
        schoolId: s.id,
        distanceMeters: Math.round(distanceInMeters(data.location, s.location)),
        walkingMinutes: Math.round(distanceInMeters(data.location, s.location) / 80) // 假设 80m/min
      }))
    }
    setRestaurantsList(prev => [newRestaurant, ...prev])
    setSelectedRestaurant(newRestaurant)
    setIsSelectingLocation(false)
  }

  const handleRandomPick = () => {
    if (visibleRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * visibleRestaurants.length)
      setSelectedRestaurant(visibleRestaurants[randomIndex])
    }
  }

  const campusHotList = useMemo(() => {
    return [...restaurantsList]
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, 3)
  }, [restaurantsList])

  return (
    <div className="ufm-app">
      <header className="ufm-header">
        <div className="ufm-header-left">
          <div className="ufm-logo">大学城美食地图</div>
        </div>
        <div className="ufm-search-container">
          <input
            className="ufm-search"
            placeholder="搜索餐厅名称或关键词，如『烧烤』『奶茶』"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ufm-header-right">
          <button
            type="button"
            className="ufm-locate-btn"
            onClick={() => {
              if (!navigator.geolocation) return
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                  setCurrentLocation(loc)
                  setMapCenter(loc)
                },
                () => {},
                { enableHighAccuracy: true, timeout: 10000 },
              )
            }}
            title="定位到我附近"
          >
            📍
          </button>
          <button
            type="button"
            className="ufm-random-btn"
            onClick={handleRandomPick}
            title="纠结吃什么？点我随机选一个！"
          >
            🎲 帮我选
          </button>
        </div>
      </header>

      <main className="ufm-main">
        <aside className="ufm-sidebar">
          <div className="ufm-sidebar-search">
            <input
              className="ufm-search"
              placeholder="搜索餐厅或分类"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <section className="ufm-panel ufm-sidebar-header">
            <div className="ufm-tabs">
              <button
                type="button"
                className={`ufm-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
                onClick={() => setActiveTab('restaurants')}
              >
                附近餐厅
              </button>
              <button
                type="button"
                className={`ufm-tab ${activeTab === 'forum' ? 'active' : ''}`}
                onClick={() => setActiveTab('forum')}
              >
                社区动态
              </button>
            </div>
          </section>

          {activeTab === 'restaurants' ? (
            <>
              <section className="ufm-panel ufm-hot-list-panel">
                <h2 className="ufm-panel-title">🏆 校园热度榜</h2>
                <div className="ufm-hot-items">
                  {campusHotList.map((r, index) => (
                    <div 
                      key={r.id} 
                      className="ufm-hot-item"
                      onClick={() => setSelectedRestaurant(r)}
                    >
                      <span className={`ufm-hot-rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="ufm-hot-name">{r.name}</span>
                      <span className="ufm-hot-score">{r.scores.overall.toFixed(1)}分</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="ufm-panel">
                <h2 className="ufm-panel-title">筛选与位置</h2>
                <SchoolSelector
                  schools={schools}
                  activeSchoolId={activeSchoolId}
                  onChange={setActiveSchoolId}
                />
                <FilterPanel value={filters} onChange={setFilters} />
              </section>

              <section className="ufm-panel ufm-panel-list">
                <h2 className="ufm-panel-title">推荐列表</h2>
                <RestaurantList
                  restaurants={visibleRestaurants}
                  onSelect={(id) => {
                    const r = restaurantsList.find((x) => x.id === id)
                    if (r) setSelectedRestaurant(r)
                  }}
                  activeSchoolId={activeSchoolId}
                />
              </section>
            </>
          ) : (
            <section className="ufm-panel ufm-panel-list ufm-forum-panel">
              <h2 className="ufm-panel-title">同学们的实时反馈</h2>
              <p className="ufm-panel-desc">查看全城最新的美食动态和真实评价。</p>
              <div className="ufm-forum-feed">
                <ReviewList
                  reviews={globalReviews}
                  restaurants={restaurantsList}
                  onSelectRestaurant={(id) => {
                    const r = restaurantsList.find((x) => x.id === id)
                    if (r) setSelectedRestaurant(r)
                  }}
                />
              </div>
            </section>
          )}
        </aside>

        <section className="ufm-map-container">
          <AmapContainer
            center={mapCenter}
            zoom={16}
            currentLocation={currentLocation}
            points={mapPoints}
            onPointClick={(id) => {
              const r = restaurantsList.find((x) => x.id === id)
              if (r) setSelectedRestaurant(r)
            }}
            onCenterChange={setMapCenter}
              onMapClick={(loc) => {
                if (isSelectingLocation) {
                  setClickedLocation(loc)
                  setIsAddModalOpen(true)
                }
              }}
              isSelectingLocation={isSelectingLocation}
              onToggleSelection={() => setIsSelectingLocation(!isSelectingLocation)}
              selectedId={selectedRestaurant?.id}
            />
          <div className="ufm-center-pin">
            <div className="ufm-center-pin-icon" />
          </div>
        </section>
      </main>

      <RestaurantDetailDrawer
        restaurant={selectedRestaurant}
        open={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        reviews={selectedRestaurant ? reviewsByRestaurant[selectedRestaurant.id] ?? [] : []}
        schoolId={activeSchool.id}
        onAddReview={(review) => {
          setReviewsByRestaurant((prev) => {
            const next = { ...prev }
            const list = next[review.restaurantId] ? [...next[review.restaurantId]] : []
            list.unshift(review)
            next[review.restaurantId] = list
            return next
          })
          
          // 如果是新餐厅且还没评分，更新一下评分显示
          if (selectedRestaurant && selectedRestaurant.reviewCount === 0) {
            setRestaurantsList(prev => prev.map(r => 
              r.id === selectedRestaurant.id 
                ? { ...r, reviewCount: 1, scores: review.scores } 
                : r
            ))
          }
        }}
      />

      {clickedLocation && (
        <AddRestaurantModal
          open={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setClickedLocation(null)
          }}
          onSubmit={handleAddRestaurant}
          initialLocation={clickedLocation}
        />
      )}
    </div>
  )
}

