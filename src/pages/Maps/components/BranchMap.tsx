import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import type { BranchSummary } from '@/types'

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 } // 서울 시청 — 지점이 없을 때 기본 위치
const MAP_CONTAINER_STYLE = { width: '100%', height: '450px' }
const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeControl: false, // 좌상단 Map/Satellite 토글
  streetViewControl: false, // 우하단 스트리트뷰 페그맨
}

interface BranchMapProps {
  branches: BranchSummary[]
}

function BranchMap({ branches }: BranchMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'travelx-google-map',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  })
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      // setState를 effect 본문에서 바로 부르지 않고 콜백 안에서 부르기 위해 microtask로 미룬다.
      queueMicrotask(() => setLocationError('This browser does not support geolocation.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      (error) => {
        // 권한 거부 등 — 위치 없이 지점 기준으로만 보여주면 되지만, 원인은 콘솔에 남겨서
        // "왜 안 뜨지"를 디버깅할 수 있게 한다 (GeolocationPositionError.code: 1=권한거부,
        // 2=위치 확인 불가, 3=타임아웃).
        console.warn('[BranchMap] geolocation failed:', error.code, error.message)
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Could not determine your location.',
        )
      },
    )
  }, [])

  // 현재 위치가 있으면 그걸 우선 중심으로, 없으면 지점들의 평균 위치, 그마저 없으면 기본값
  const center = useMemo(() => {
    if (userLocation) return userLocation
    if (branches.length === 0) return DEFAULT_CENTER
    const sum = branches.reduce(
      (acc, b) => ({ lat: acc.lat + b.latitude, lng: acc.lng + b.longitude }),
      { lat: 0, lng: 0 },
    )
    return { lat: sum.lat / branches.length, lng: sum.lng / branches.length }
  }, [branches, userLocation])

  const activeBranch = branches.find((b) => b.id === activeBranchId) ?? null

  if (loadError) {
    return (
      <div
        style={MAP_CONTAINER_STYLE}
        className="flex items-center justify-center bg-gray-100 text-[13px] text-gray-400"
      >
        Couldn&apos;t load the map.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        style={MAP_CONTAINER_STYLE}
        className="flex items-center justify-center bg-gray-100 text-[13px] text-gray-400"
      >
        Loading map…
      </div>
    )
  }

  return (
    <div className="relative">
      {locationError && (
        <p className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] text-gray-500 shadow">
          {locationError}
        </p>
      )}
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={13}
        options={MAP_OPTIONS}
      >
      {userLocation && (
        <MarkerF
          position={userLocation}
          title="Your location"
          zIndex={999}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      )}

      {branches.map((branch) => (
        <MarkerF
          key={branch.id}
          position={{ lat: branch.latitude, lng: branch.longitude }}
          onClick={() => setActiveBranchId(branch.id)}
        />
      ))}

      {activeBranch && (
        <InfoWindowF
          position={{ lat: activeBranch.latitude, lng: activeBranch.longitude }}
          onCloseClick={() => setActiveBranchId(null)}
        >
          <div className="text-[12px]">
            <p className="font-bold text-gray-900">{activeBranch.name}</p>
            <p className="text-gray-500">{activeBranch.address}</p>
          </div>
        </InfoWindowF>
      )}
      </GoogleMap>
    </div>
  )
}

export default BranchMap
