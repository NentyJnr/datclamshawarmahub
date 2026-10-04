import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const storeIcon = L.divIcon({
  className: 'custom-store-pin',
  html: `<div class="bg-orange-600 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center font-bold text-xs">🏪 Store</div>`,
  iconSize: [45, 45],
  iconAnchor: [22, 22]
});

const customerIcon = L.divIcon({
  className: 'custom-customer-pin',
  html: `<div class="bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center font-bold text-xs">📍 Home</div>`,
  iconSize: [45, 45],
  iconAnchor: [22, 22]
});

const riderIcon = L.divIcon({
  className: 'custom-pulsing-marker',
  html: `
    <div class="pulse-ring"></div>
    <div class="relative z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2 rounded-full shadow-xl border-2 border-white font-bold text-sm">
      🛵 Rider
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25]
});

interface MapProps {
  storeLat?: number;
  storeLon?: number;
  customerLat: number;
  customerLon: number;
  riderLat?: number;
  riderLon?: number;
}

// Auto-recenter map hook
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: true });
  }, [lat, lng, map]);
  return null;
}

export const MapComponent: React.FC<MapProps> = ({
  storeLat = 6.5244,
  storeLon = 3.3792,
  customerLat,
  customerLon,
  riderLat,
  riderLon,
}) => {
  const activeRiderLat = riderLat || storeLat;
  const activeRiderLon = riderLon || storeLon;

  const polylineCoords: [number, number][] = [
    [storeLat, storeLon],
    [activeRiderLat, activeRiderLon],
    [customerLat, customerLon]
  ];

  return (
    <div className="w-full h-80 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <MapContainer
        center={[customerLat, customerLon]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Store Location */}
        <Marker position={[storeLat, storeLon]} icon={storeIcon}>
          <Popup>Datclam Groceries Base Store</Popup>
        </Marker>

        {/* Customer Location */}
        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Delivery Destination</Popup>
        </Marker>

        {/* Rider Location */}
        <Marker position={[activeRiderLat, activeRiderLon]} icon={riderIcon}>
          <Popup>Dispatch Rider Active Position</Popup>
        </Marker>

        {/* Dynamic Route Polyline */}
        <Polyline positions={polylineCoords} color="#f97316" weight={4} dashArray="8, 8" />

        <MapRecenter lat={activeRiderLat} lng={activeRiderLon} />
      </MapContainer>
    </div>
  );
};
