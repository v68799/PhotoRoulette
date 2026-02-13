
import React, { useEffect, useRef, useState } from 'react';
import { Snap } from '../types';

// Vertel TypeScript dat L globaal beschikbaar is via het script in de HTML
declare const L: any;

interface WorldMapProps {
  snaps: Snap[];
  onSnapClick: (snap: Snap) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ snaps, onSnapClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    // We checken herhaaldelijk of 'L' al gedefinieerd is (om race conditions te voorkomen)
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && (window as any).L) {
        setIsLeafletReady(true);
      } else if (typeof L !== 'undefined') {
        setIsLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 100);
      }
    };
    checkLeaflet();
  }, []);

  useEffect(() => {
    // Alleen initialiseren als Leaflet klaar is en de container er is
    if (!isLeafletReady || !mapContainerRef.current || mapRef.current) return;

    try {
      const leaflet = (window as any).L || L;
      
      mapRef.current = leaflet.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2.5,
        zoomControl: false,
        attributionControl: false,
        minZoom: 2,
      });

      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    } catch (err) {
      console.error("Fout bij het laden van de kaart:", err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLeafletReady]);

  useEffect(() => {
    if (!mapRef.current || !isLeafletReady) return;
    const leaflet = (window as any).L || L;

    // Verwijder oude markers
    const currentSnapIds = new Set(snaps.map(s => s.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentSnapIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Voeg nieuwe markers toe
    snaps.forEach(snap => {
      if (!markersRef.current.has(snap.id)) {
        const icon = leaflet.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pulse"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = leaflet.marker([snap.latitude, snap.longitude], { icon })
          .addTo(mapRef.current)
          .on('click', () => onSnapClick(snap));
        
        markersRef.current.set(snap.id, marker);
      }
    });
  }, [snaps, onSnapClick, isLeafletReady]);

  return (
    <div className="relative w-full h-full bg-slate-900">
      {!isLeafletReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-[60]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white/60 font-medium italic">De wereldkaart wordt geladen...</p>
          </div>
        </div>
      )}
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
