import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Camera, Settings, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types/tree';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { latLngToCell } from 'h3-js';
import { useTree } from '@/contexts/TreeContext';
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

// Component to handle map updates with smooth animation
const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
};

const OSMTreeMap = ({ trees, onTreeClick, onCameraClick }: OSMTreeMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [address, setAddress] = useState<string>('');
  const [draggedTreeId, setDraggedTreeId] = useState<string | null>(null);
  const { updateTree } = useTree();

  // Enhanced geolocation with better accuracy for Indian locations
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Accurate location obtained:', latitude, longitude);
          
          const newLocation: [number, number] = [latitude, longitude];
          setUserLocation(newLocation);
          
          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const displayName = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setAddress(displayName);
            console.log('Address resolved:', displayName);
          } catch (error) {
            console.error('Geocoding failed:', error);
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Enhanced geolocation error:', error);
          // Fallback to Maharashtra center instead of Delhi
          const maharashtraCenter: [number, number] = [19.7515, 75.7139];
          setUserLocation(maharashtraCenter);
          setAddress('Maharashtra, India (Approximate)');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        }
      );
    } else {
      // Default to Maharashtra center
      setUserLocation([19.7515, 75.7139]);
      setAddress('Maharashtra, India (Geolocation not supported)');
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    console.log('OSMTreeMap loaded with trees:', trees.length);
    getCurrentLocation();
  }, [trees]);

  const handleLocateUser = () => {
    getCurrentLocation();
  };

  const handleMarkerDragEnd = async (tree: Tree, event: any) => {
    const newPosition = event.target.getLatLng();
    const newLat = newPosition.lat;
    const newLng = newPosition.lng;
    
    console.log(`Tree ${tree.name} dragged to: lat=${newLat}, lng=${newLng}`);
    
    try {
      // Generate new H3 index for the new location with resolution 9
      const newH3Index = latLngToCell(newLat, newLng, 9);
      console.log(`Generated new H3 index: ${newH3Index}`);
      
      // Create the update object with the new location
      const locationUpdate = {
        location: {
          lat: newLat,
          lng: newLng,
          h3Index: newH3Index,
          address: tree.location.address // Keep existing address or update if needed
        }
      };
      
      console.log('Updating tree with:', locationUpdate);
      
      // Update the tree's location in the context
      await updateTree(tree.id, locationUpdate);
      
      console.log(`Successfully updated tree ${tree.name} location. New H3: ${newH3Index}`);
      
      // Optional: Get reverse geocoded address for the new location
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`
        );
        const geoData = await response.json();
        
        if (geoData.display_name) {
          // Update with the new address as well
          await updateTree(tree.id, {
            location: {
              ...locationUpdate.location,
              address: geoData.display_name
            }
          });
          console.log(`Updated address for tree ${tree.name}: ${geoData.display_name}`);
        }
      } catch (geoError) {
        console.warn('Failed to get reverse geocoded address:', geoError);
        // Continue without address update - not critical
      }
      
    } catch (error) {
      console.error('Error updating tree location:', error);
      
      // Revert the marker position on error
      event.target.setLatLng([tree.location.lat, tree.location.lng]);
      
      // Optionally show user feedback here
      alert('Failed to update tree location. Please try again.');
    } finally {
      setDraggedTreeId(null);
    }
  };

  if (!userLocation) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading map...</p>
          <p className="text-xs text-muted-foreground">Detecting your location...</p>
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
          className="z-0 rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapUpdater center={userLocation} />
          
          {/* User location marker - NOT draggable */}
          <Marker position={userLocation} icon={createUserIcon()}>
            <Popup>
              <div className="text-center max-w-xs">
                <strong className="text-green-800">Your Location</strong>
                <br />
                <small className="text-xs text-muted-foreground">
                  {address}
                </small>
                <br />
                <small className="text-xs">Lat: {userLocation[0].toFixed(6)}</small>
                <br />
                <small className="text-xs">Lng: {userLocation[1].toFixed(6)}</small>
              </div>
            </Popup>
          </Marker>

          {/* Tree markers - draggable */}
          {trees.map((tree) => (
            <Marker
              key={`${tree.id}-${tree.location.lat}-${tree.location.lng}`} // Force re-render on location change
              position={[tree.location.lat, tree.location.lng]}
              icon={createTreeIcon(tree.category)}
              draggable={true}
              eventHandlers={{
                click: () => onTreeClick(tree),
                dragstart: () => {
                  setDraggedTreeId(tree.id);
                  console.log(`Started dragging tree: ${tree.name}`);
                },
                dragend: (e) => handleMarkerDragEnd(tree, e)
              }}
            >
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <h3 className="font-semibold text-green-800">{tree.name}</h3>
                  <p className="text-sm text-muted-foreground">{tree.scientificName}</p>
                  <p className="text-xs text-blue-600 capitalize">{tree.category} forestry</p>
                  <p className="text-xs text-muted-foreground">H3: {tree.location.h3Index}</p>
                  <p className="text-xs text-gray-600">
                    Lat: {tree.location.lat.toFixed(6)}, Lng: {tree.location.lng.toFixed(6)}
                  </p>
                  {tree.measurements.height && (
                    <p className="text-xs">Height: {tree.measurements.height}m</p>
                  )}
                  {tree.isAIGenerated && (
                    <p className="text-xs text-purple-600">🤖 AI Generated</p>
                  )}
                  {tree.isVerified && (
                    <p className="text-xs text-green-600">✅ Verified</p>
                  )}
                  <p className="text-xs text-orange-600">📍 Drag to adjust tree position</p>
                  {draggedTreeId === tree.id && (
                    <p className="text-xs text-blue-600 font-semibold">🔄 Dragging...</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Enhanced Camera FAB */}
      <Button
        onClick={onCameraClick}
        size="lg"
        className="fixed top-20 right-4 z-10 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-200 hover:scale-105 dark:bg-green-700 dark:hover:bg-green-800"
      >
        <Camera className="h-6 w-6 text-white" />
      </Button>

      {/* Enhanced Locate User FAB */}
      <Button
        onClick={handleLocateUser}
        size="sm"
        variant="outline"
        disabled={isLoadingLocation}
        className="fixed bottom-24 right-4 z-10 rounded-full w-12 h-12 bg-white dark:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105"
      >
        {isLoadingLocation ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        ) : (
          <Locate className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        )}
      </Button>

      {/* Settings FAB */}
      <Button
        onClick={() => setShowSettings(true)}
        size="sm"
        variant="outline"
        className="fixed top-20 left-4 z-10 rounded-full w-10 h-10 bg-white dark:bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Settings className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </Button>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Map Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                Using OpenStreetMap tiles
              </p>
              <p className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
                No API key required • Free and open source
              </p>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">Current Location</p>
              <p className="text-xs text-green-700 dark:text-green-400">{address}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="dark:text-gray-300">Farm Forestry ({trees.filter(t => t.category === 'farm').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="dark:text-gray-300">Community Forestry ({trees.filter(t => t.category === 'community').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="dark:text-gray-300">Nursery Forestry ({trees.filter(t => t.category === 'nursery').length})</span>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground dark:text-gray-400">
              Total Trees: {trees.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMTreeMap;
