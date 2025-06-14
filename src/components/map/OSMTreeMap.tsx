
import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';
import { latLngToCell } from 'h3-js';
import { useTree } from '@/contexts/TreeContext';
import MapControls from './MapControls';
import MapSettings from './MapSettings';
import UserLocationMarker from './UserLocationMarker';
import TreeMarker from './TreeMarker';
import MapUpdater from './MapUpdater';
import TreeForm from '@/components/tree/TreeForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

// Component to handle map click events
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e: any) => {
      // Get the clicked location coordinates
      const { lat, lng } = e.latlng;
      console.log('Map clicked at coordinates:', lat, lng);
      onMapClick(lat, lng);
    };

    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

const OSMTreeMap = ({ trees, onTreeClick, onCameraClick }: OSMTreeMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTreeForm, setShowTreeForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [address, setAddress] = useState<string>('');
  const [draggedTreeId, setDraggedTreeId] = useState<string | null>(null);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const { updateTree, addTree } = useTree();

  // Enhanced geolocation with better accuracy for Indian locations
  const getCurrentLocation = useCallback(() => {
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
  }, []);

  useEffect(() => {
    console.log('OSMTreeMap loaded with trees:', trees.length);
    getCurrentLocation();
  }, [trees, getCurrentLocation]);

  const handleLocateUser = () => {
    getCurrentLocation();
  };

  const handleMarkerDragEnd = async (tree: Tree, newLat: number, newLng: number) => {
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
      alert('Failed to update tree location. Please try again.');
    } finally {
      setDraggedTreeId(null);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    
    // Get reverse geocoded address for the clicked location
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const geoData = await response.json();
      const clickedAddress = geoData.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      console.log('Clicked location address:', clickedAddress);
      
      // Show the clicked location info and open tree form
      setClickedLocation({ lat, lng });
      setShowTreeForm(true);
      
      // Optional: Show a temporary toast with the location info
      console.log(`Location clicked: ${clickedAddress}`);
      
    } catch (error) {
      console.error('Failed to get address for clicked location:', error);
      // Still proceed with coordinates
      setClickedLocation({ lat, lng });
      setShowTreeForm(true);
    }
  };

  const handleTreeFormSubmit = async (data: any, location: { lat: number; lng: number }) => {
    try {
      await addTree(data, location);
      setShowTreeForm(false);
      setClickedLocation(null);
      console.log('Tree added successfully at clicked location');
    } catch (error) {
      console.error('Failed to add tree:', error);
    }
  };

  const toggleSatelliteView = () => {
    setIsSatelliteView(!isSatelliteView);
    console.log('Toggling satellite view:', !isSatelliteView);
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
            url={isSatelliteView 
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={isSatelliteView
              ? '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          
          <MapUpdater center={userLocation} />
          <MapClickHandler onMapClick={handleMapClick} />
          
          <UserLocationMarker position={userLocation} address={address} />

          {trees.map((tree) => (
            <TreeMarker
              key={`tree-${tree.id}`}
              tree={tree}
              onTreeClick={onTreeClick}
              onDragEnd={handleMarkerDragEnd}
              isDragging={draggedTreeId === tree.id}
              onDragStart={() => {
                setDraggedTreeId(tree.id);
                console.log(`Started dragging tree: ${tree.name}`);
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Satellite View Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleSatelliteView}
          variant={isSatelliteView ? "default" : "outline"}
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          {isSatelliteView ? "Street View" : "Satellite"}
        </Button>
      </div>

      <MapControls
        onCameraClick={onCameraClick}
        onSettingsClick={() => setShowSettings(true)}
        onLocateClick={handleLocateUser}
        isLocating={isLoadingLocation}
      />

      <MapSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        trees={trees}
        address={address}
      />

      <Dialog open={showTreeForm} onOpenChange={setShowTreeForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {clickedLocation && (
            <TreeForm
              onSubmit={handleTreeFormSubmit}
              onClose={() => {
                setShowTreeForm(false);
                setClickedLocation(null);
              }}
              initialLocation={clickedLocation}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMTreeMap;
