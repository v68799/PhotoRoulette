
import React, { useEffect, useRef } from 'react';
import { Snap } from '../types';

// We import Leaflet globally via CDN in HTML, so we use it directly here
declare const L: any;

interface WorldMapProps {
  snaps: Snap[];
  onSnapClick: (snap: Snap) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ snaps, onSnapClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
    });

    // Dark styled tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers that aren't in current snaps
    const currentSnapIds = new Set(snaps.map(s => s.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentSnapIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add new markers
    snaps.forEach(snap => {
      if (!markersRef.current.has(snap.id)) {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pulse"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([snap.latitude, snap.longitude], { icon })
          .addTo(mapRef.current)
          .on('click', () => onSnapClick(snap));
        
        markersRef.current.set(snap.id, marker);
      }
    });
  }, [snaps, onSnapClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      <style>{`
        .marker-pulse {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px #3b82f6;
          position: relative;
        }
        .marker-pulse::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          animation: pulse 2s infinite ease-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WorldMap;
