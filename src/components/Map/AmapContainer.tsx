import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import type { LatLng } from '../../types'
import './Amap.css'

interface MapPoint {
  id: string
  name: string
  location: LatLng
}

interface AmapContainerProps {
  center: LatLng
  zoom?: number
  children?: ReactNode
  currentLocation?: LatLng | null
  points?: MapPoint[]
  onPointClick?: (id: string) => void
  onCenterChange?: (center: LatLng) => void
  onMapClick?: (loc: LatLng) => void
  isSelectingLocation?: boolean
  onToggleSelection?: () => void
  selectedId?: string | null
}

export function AmapContainer({
  center,
  zoom = 16,
  children,
  currentLocation,
  points,
  onPointClick,
  onCenterChange,
  onMapClick,
  isSelectingLocation,
  onToggleSelection,
  selectedId,
}: AmapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const locationMarkerRef = useRef<any | null>(null)
  const pointMarkersRef = useRef<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setDefaultCursor(isSelectingLocation ? 'crosshair' : 'default')
  }, [isSelectingLocation])

  useEffect(() => {
    if (!mapRef.current) return

    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE || 'f2836844f50057c85bf2fe9e03a9df4d',
    }

    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY || '141fcdabe032ae93334074cfab19228f',
      version: '2.0',
      plugins: [],
    })
      .then((AMap) => {
        if (!mapRef.current) return

        const map = new AMap.Map(mapRef.current, {
          zoom,
          center: [center.lng, center.lat],
          viewMode: '3D',
        })
        mapInstanceRef.current = map

        if (onCenterChange) {
          map.on('moveend', () => {
            const c = map.getCenter()
            onCenterChange({ lat: c.lat, lng: c.lng })
          })
        }

        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick({ lat: e.lnglat.lat, lng: e.lnglat.lng })
          })
        }
      })
      .catch(() => {
        setError('地图加载失败，请稍后重试')
      })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
    // 只在首次挂载时初始化地图
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setCenter([center.lng, center.lat])
  }, [center.lng, center.lat])

  useEffect(() => {
    const map = mapInstanceRef.current
    const AMap = (window as any).AMap
    if (!map || !AMap) return

    if (locationMarkerRef.current) {
      map.remove(locationMarkerRef.current)
      locationMarkerRef.current = null
    }

    if (currentLocation) {
      const marker = new AMap.CircleMarker({
        center: [currentLocation.lng, currentLocation.lat],
        radius: 6,
        strokeColor: '#2563eb',
        strokeWeight: 2,
        strokeOpacity: 1,
        fillColor: '#3b82f6',
        fillOpacity: 0.9,
      })
      map.add(marker)
      locationMarkerRef.current = marker
    }
  }, [currentLocation])

  useEffect(() => {
    const map = mapInstanceRef.current
    const AMap = (window as any).AMap
    if (!map || !AMap) return

    if (pointMarkersRef.current.length) {
      map.remove(pointMarkersRef.current)
      pointMarkersRef.current = []
    }

    if (points && points.length) {
      const markers: any[] = []
      for (const p of points) {
        const isSelected = p.id === selectedId
        const marker = new AMap.Marker({
          position: [p.location.lng, p.location.lat],
          title: p.name,
          icon: isSelected 
            ? 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png' 
            : 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
          label: isSelected ? {
            content: `<div class="ufm-marker-label">${p.name}</div>`,
            direction: 'top'
          } : undefined,
          zIndex: isSelected ? 100 : 10,
        })
        if (onPointClick) {
          marker.on('click', () => onPointClick(p.id))
        }
        markers.push(marker)
      }
      map.add(markers)
      pointMarkersRef.current = markers
    }
  }, [points, selectedId])

  return (
    <div className="ufm-amap-root">
      <div ref={mapRef} className="ufm-amap-canvas" />
      {isSelectingLocation && (
        <div className="ufm-selection-tip">📍 请在地图上点击新店铺的位置</div>
      )}
      <button
        type="button"
        className={isSelectingLocation ? 'ufm-add-btn-fab active' : 'ufm-add-btn-fab'}
        onClick={onToggleSelection}
        title={isSelectingLocation ? '取消添加' : '添加新店铺'}
      >
        {isSelectingLocation ? '✕' : '＋'}
      </button>
      {children}
      {error && <div className="ufm-amap-error">{error}</div>}
    </div>
  )
}

