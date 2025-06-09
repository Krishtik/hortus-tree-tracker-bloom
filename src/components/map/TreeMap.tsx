
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { latLngToCell } from 'h3-js';
import { Camera, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types/tree';
import GoogleMapsSettings from '@/components/settings/GoogleMapsSettings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TreeMapProps {
  trees: Tree[];
  onTreeClick: (tree: Tree) => void;
  onCameraClick: () => void;
}

const TreeMap = ({ trees, onTreeClick, onCameraClick }: TreeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [googleMapsKey, setGoogleMapsKey] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Category colors for tree markers
  const categoryColors = {
    farm: '#22c55e',      // Green
    community: '#3b82f6', // Blue
    nursery: '#eab308'    // Yellow
  };

  useEffect(() => {
    // Check for stored Google Maps API key
    const apiKey = localStorage.getItem('google_maps_api_key');
    setGoogleMapsKey(apiKey);
  }, []);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to New Delhi, India
          setUserLocation([77.2090, 28.6139]);
        }
      );
    } else {
      setUserLocation([77.2090, 28.6139]);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !userLocation || !googleMapsKey || mapLoaded) return;

    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: userLocation[1], lng: userLocation[0] },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add user location marker
      new google.maps.Marker({
        position: { lat: userLocation[1], lng: userLocation[0] },
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#ef4444" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        }
      });

      setMapLoaded(true);
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });
  }, [userLocation, googleMapsKey, mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing tree markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add tree markers
    trees.forEach((tree) => {
      const color = categoryColors[tree.category];
      
      const marker = new google.maps.Marker({
        position: { lat: tree.location.lat, lng: tree.location.lng },
        map: mapInstanceRef.current,
        title: tree.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
              <path d="M12 6v12M6 12h12" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-weight: 600;">${tree.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${tree.scientificName}</p>
            <p style="margin: 0 0 4px 0; color: #999; font-size: 12px;">${tree.category} forestry</p>
            <p style="margin: 0; color: #999; font-size: 12px;">H3: ${tree.location.h3Index}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        onTreeClick(tree);
      });

      markersRef.current.push(marker);
    });
  }, [trees, onTreeClick, mapLoaded]);

  if (!googleMapsKey) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4 p-8">
          <Settings className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Google Maps Configuration Required</h3>
            <p className="text-muted-foreground mb-4">
              To use the map features, please configure your Google Maps API key.
            </p>
            <Button onClick={() => setShowSettings(true)}>
              Configure Google Maps
            </Button>
          </div>
        </div>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Map Configuration</DialogTitle>
            </DialogHeader>
            <GoogleMapsSettings />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Camera FAB */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed top-20 right-4 z-10 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
      >
        <Camera className="h-6 w-6" />
      </Button>

      {/* Settings FAB */}
      <Button
        onClick={() => setShowSettings(true)}
        size="sm"
        variant="outline"
        className="fixed top-20 left-4 z-10 rounded-full w-10 h-10 bg-white shadow-lg"
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Map Settings</DialogTitle>
          </DialogHeader>
          <GoogleMapsSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TreeMap;
