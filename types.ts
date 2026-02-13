
export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface Snap {
  id: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  caption?: string;
  senderName: string;
  timestamp: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}
