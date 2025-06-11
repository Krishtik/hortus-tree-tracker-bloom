
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

// Custom icon creator for different tree categories using L.icon
const createTreeIcon = (category: string) => {
  const iconUrls = {
    farm: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    community: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    nursery: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
  };
  
  const iconUrl = iconUrls[category as keyof typeof iconUrls] || iconUrls.farm;
  
  return L.icon({
    iconUrl: iconUrl,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// User location icon
const createUserIcon = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32]
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
    console.log('OSMTreeMap loaded with trees:', trees.length);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
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
  }, [trees]);

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
      <div style={{ height: '70vh', width: '100%' }}>
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
                  {tree.isAIGenerated && (
                    <p className="text-xs text-purple-600">🤖 AI Generated</p>
                  )}
                  {tree.isVerified && (
                    <p className="text-xs text-green-600">✅ Verified</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

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
                <span>Farm Forestry ({trees.filter(t => t.category === 'farm').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Community Forestry ({trees.filter(t => t.category === 'community').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Nursery Forestry ({trees.filter(t => t.category === 'nursery').length})</span>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Total Trees: {trees.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMTreeMap;
