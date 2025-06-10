
import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Camera, Settings, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types/tree';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface OSMTreeMapProps {
  trees: Tree[];
  onTreeClick: (tree: Tree) => void;
  onCameraClick: () => void;
}

// Custom icon creator for different tree categories
const createTreeIcon = (category: string) => {
  const colors = {
    farm: '#22c55e',      // Green
    community: '#3b82f6', // Blue
    nursery: '#eab308'    // Yellow
  };
  
  const color = colors[category as keyof typeof colors] || '#22c55e';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">🌳</div>
      </div>
    `,
    className: 'custom-tree-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// User location icon
const createUserIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    className: 'user-location-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Component to handle map updates
const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

const OSMTreeMap = ({ trees, onTreeClick, onCameraClick }: OSMTreeMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to New Delhi, India
          setUserLocation([28.6139, 77.2090]);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setUserLocation([28.6139, 77.2090]);
      setIsLoadingLocation(false);
    }
  }, []);

  const handleLocateUser = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000
        }
      );
    }
  };

  if (!userLocation) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={userLocation} />
        
        {/* User location marker */}
        <Marker position={userLocation} icon={createUserIcon()}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
              <br />
              <small>Lat: {userLocation[0].toFixed(6)}</small>
              <br />
              <small>Lng: {userLocation[1].toFixed(6)}</small>
            </div>
          </Popup>
        </Marker>

        {/* Tree markers */}
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.location.lat, tree.location.lng]}
            icon={createTreeIcon(tree.category)}
            eventHandlers={{
              click: () => onTreeClick(tree)
            }}
          >
            <Popup>
              <div className="space-y-2 min-w-[200px]">
                <h3 className="font-semibold text-green-800">{tree.name}</h3>
                <p className="text-sm text-muted-foreground">{tree.scientificName}</p>
                <p className="text-xs text-blue-600 capitalize">{tree.category} forestry</p>
                <p className="text-xs text-muted-foreground">H3: {tree.location.h3Index}</p>
                {tree.measurements.height && (
                  <p className="text-xs">Height: {tree.measurements.height}m</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Camera FAB */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed top-20 right-4 z-10 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
      >
        <Camera className="h-6 w-6" />
      </Button>

      {/* Locate User FAB */}
      <Button
        onClick={handleLocateUser}
        size="sm"
        variant="outline"
        disabled={isLoadingLocation}
        className="fixed bottom-24 right-4 z-10 rounded-full w-12 h-12 bg-white shadow-lg"
      >
        {isLoadingLocation ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        ) : (
          <Locate className="h-4 w-4" />
        )}
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
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Using OpenStreetMap tiles
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                No API key required • Free and open source
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Farm Forestry</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Community Forestry</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Nursery Forestry</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMTreeMap;
