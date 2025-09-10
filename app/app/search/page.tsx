import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

export default function SearchPage(){ /* ...estado y buscar() como arriba... */
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstance.current) return
    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [lng, lat],
      zoom: 13
    })
    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-right')
  }, [])

  // cuando cambian resultados, dibujar marcadores
  useEffect(()=>{
    if(!mapInstance.current) return
    // limpiar anteriores
    markersRef.current.forEach(m=>m.remove())
    markersRef.current = []
    // centrar
    mapInstance.current.setCenter([lng, lat])
    // agregar cada punto (si API devuelve lon/lat, si no, omitilo)
    results.forEach((r:any)=>{
      if (typeof r.lon === 'number' && typeof r.lat === 'number') {
        const el = document.createElement('div')
        el.style.width='12px'; el.style.height='12px'; el.style.borderRadius='50%';
        el.style.background='#6ee7b7'; el.style.boxShadow='0 0 0 4px rgba(110,231,183,.2)'
        const mk = new maplibregl.Marker({element:el}).setLngLat([r.lon, r.lat]).addTo(mapInstance.current)
        markersRef.current.push(mk)
      }
    })
  }, [results, lat, lng])

  return (
    <div className="grid-2">
      {/* panel izquierdo igual que en 2.3 */}
      <section className="panel card"> {/* ...form + lista... */}</section>
      <aside className="panel card">
        <h3 style={{marginTop:0}}>Mapa</h3>
        <div ref={mapRef} className="mapbox" />
      </aside>
    </div>
  )
}
