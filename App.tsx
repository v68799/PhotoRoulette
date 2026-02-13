
import React, { useState, useEffect, useCallback } from 'react';
import { User, Snap, LatLng } from './types';
import Login from './components/Login';
import WorldMap from './components/WorldMap';
import CameraOverlay from './components/CameraOverlay';
import { getCityName } from './services/geminiService';

const MOCK_SNAPS: Snap[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    latitude: 35.6762,
    longitude: 139.6503,
    locationName: 'Tokio, Japan',
    caption: 'Neonlichten en drukke straten in het hart van de stad.',
    senderName: 'Hiroshi',
    timestamp: Date.now() - 3600000
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
    latitude: -22.9068,
    longitude: -43.1729,
    locationName: 'Rio de Janeiro, Brazilië',
    caption: 'De zon zakt langzaam achter de bergen.',
    senderName: 'Ananda',
    timestamp: Date.now() - 7200000
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    latitude: 48.8566,
    longitude: 2.3522,
    locationName: 'Parijs, Frankrijk',
    caption: 'Bonjour vanuit de stad van de liefde.',
    senderName: 'Julie',
    timestamp: Date.now() - 100000
  }
];

const RANDOM_NAMES = ['Lukas', 'Elena', 'Mateo', 'Yuki', 'Sienna', 'Aarav', 'Amara'];
const RANDOM_CAPTIONS = [
  'Prachtige ochtend hier.',
  'De sfeer is magisch vandaag.',
  'Even genieten van het uitzicht.',
  'Groeten uit de verte!',
  'Wat een bijzondere plek is dit.'
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [snaps, setSnaps] = useState<Snap[]>(MOCK_SNAPS);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Snap | null>(null);
  const [incomingNotification, setIncomingNotification] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Locatie toegang geweigerd", error)
      );
    }
  }, []);

  // Simulatie van inkomende snaps van andere gebruikers
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      // 20% kans elke 15 seconden op een nieuwe inkomende snap
      if (Math.random() > 0.8) {
        const randomLat = (Math.random() * 140) - 70;
        const randomLng = (Math.random() * 360) - 180;
        const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
        const randomCaption = RANDOM_CAPTIONS[Math.floor(Math.random() * RANDOM_CAPTIONS.length)];
        
        const incomingSnap: Snap = {
          id: Math.random().toString(36).substring(7),
          imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
          latitude: randomLat,
          longitude: randomLng,
          locationName: 'Ergens op de wereld',
          caption: randomCaption,
          senderName: randomName,
          timestamp: Date.now()
        };

        setSnaps(prev => [incomingSnap, ...prev]);
        setIncomingNotification(`Nieuwe snap ontvangen van ${randomName}!`);
        setTimeout(() => setIncomingNotification(null), 5000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSendSnap = async (imageUrl: string, lat: number, lng: number, caption: string) => {
    const locationName = await getCityName(lat, lng);
    const newSnap: Snap = {
      id: Math.random().toString(36).substring(7),
      imageUrl,
      latitude: lat,
      longitude: lng,
      locationName,
      caption,
      senderName: currentUser?.name || 'Anoniem',
      timestamp: Date.now()
    };

    setSnaps(prev => [newSnap, ...prev]);
    setShowCamera(false);
    
    // Toon de eigen verzonden snap direct
    setTimeout(() => setSelectedSnap(newSnap), 500);
  };

  const handleSnapClick = useCallback((snap: Snap) => {
    setSelectedSnap(snap);
  }, []);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-sans">
      {/* Wereldkaart */}
      <WorldMap snaps={snaps} onSnapClick={handleSnapClick} />

      {/* Gebruikersprofiel */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-4 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
        <img src={currentUser.photoUrl} alt="Profiel" className="w-10 h-10 rounded-full border border-blue-500 shadow-glow" />
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm">{currentUser.name}</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-blue-400 text-[10px] uppercase tracking-wider font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* Inkomende notificatie */}
      {incomingNotification && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3">
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {incomingNotification}
          </div>
        </div>
      )}

      {/* Actieknoppen */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center items-center">
        <button 
          onClick={() => setShowCamera(true)}
          className="group relative flex items-center justify-center transition-all active:scale-95"
        >
          <div className="absolute -inset-6 bg-blue-500 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity animate-pulse"></div>
          <div className="relative bg-white text-slate-900 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-transform hover:scale-105">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Snap Preview Modaal */}
      {selectedSnap && (
        <div 
          className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          onClick={() => setSelectedSnap(null)}
        >
          <div 
            className="bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4]">
              <img src={selectedSnap.imageUrl} alt="Wereld snap" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                    {selectedSnap.locationName}
                  </span>
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight mb-4 italic">
                  "{selectedSnap.caption}"
                </h3>
                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                      {selectedSnap.senderName[0]}
                    </div>
                    <span className="text-white/90 font-medium">{selectedSnap.senderName}</span>
                  </div>
                  <span className="text-white/40 text-xs">{new Date(selectedSnap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSnap(null)}
                className="absolute top-6 right-6 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/60 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera UI */}
      {showCamera && (
        <CameraOverlay 
          userLocation={userLocation}
          onClose={() => setShowCamera(false)} 
          onSend={handleSendSnap}
        />
      )}

      {/* Tooltip voor nieuwe gebruikers */}
      {snaps.length <= 4 && (
        <div className="absolute bottom-36 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl text-sm font-bold shadow-2xl animate-bounce flex items-center gap-3">
             Klik om jouw wereld te delen 🌍
          </div>
        </div>
      )}

      <style>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;
