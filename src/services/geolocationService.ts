// Real-Time Device GPS Telemetry & Reverse Geocoding Engine - Localized to Guntur City

export interface GPSLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
  city?: string;
}

class GeolocationService {
  /**
   * Acquire real physical device GPS coordinates from browser Geolocation API
   */
  async getDeviceCoordinates(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn('Browser GPS permission declined or unavailable, falling back to Guntur City Center:', error);
            // Default center: Guntur City Center, Andhra Pradesh
            resolve({ lat: 16.3067, lng: 80.4365 });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        // Default center: Guntur City Center, Andhra Pradesh
        resolve({ lat: 16.3067, lng: 80.4365 });
      }
    });
  }

  /**
   * Reverse Geocode Lat/Lng into human readable Street Address using OpenStreetMap Nominatim API
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en'
          }
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    } catch (err) {
      console.warn('Reverse geocoding fetch notice:', err);
    }
    return `Brodipet 5th Line, Guntur City, Andhra Pradesh 522002`;
  }

  /**
   * High-Frequency Continuous Device GPS Stream Watcher for Driver Telemetry
   */
  watchDeviceGPS(onLocationUpdate: (coords: { lat: number; lng: number; speed?: number }) => void): number | null {
    if ('geolocation' in navigator) {
      return navigator.geolocation.watchPosition(
        (pos) => {
          onLocationUpdate({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 24
          });
        },
        (err) => console.warn('GPS Stream Notice:', err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }
    return null;
  }

  clearGPSWatch(watchId: number) {
    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}

export const geolocationService = new GeolocationService();
