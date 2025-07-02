import React, { useEffect, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';
import { useTree } from '@/contexts/TreeContext';
import MapControls from './MapControls';
import MapSettings from './MapSettings';
import UserLocationMarker from './UserLocationMarker';
import TreeMarker from './TreeMarker';
import MapUpdater from './MapUpdater';
import MapClickHandler from './MapClickHandler';
import LocationPopup from './LocationPopup';
import SatelliteToggle from './SatelliteToggle';
import TreeForm from '@/components/tree/TreeForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { latLngToCell } from 'h3-js';
import { OSMTreeMapProps } from '@/types/map';

// 🧭 Simple fallback geocoder
const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// 🗺️ Default center (India)
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

const OSMTreeMap = ({
  trees,
  onTreeClick,
  onCameraClick,
  isSatelliteView = false,
  onSatelliteToggle
}: OSMTreeMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTreeForm, setShowTreeForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [address, setAddress] = useState<string>('Click "Locate Me" to detect location');
  const [draggedTreeId, setDraggedTreeId] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const { updateTree, addTree } = useTree();

  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const { lat, lng, zoom } = event.detail;
      if (mapInstance) {
        mapInstance.setView([lat, lng], zoom);
      }
    };

    window.addEventListener('navigateToLocation', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigateToLocation', handleNavigation as EventListener);
    };
  }, [mapInstance]);

const getCurrentLocation = useCallback(() => {
  setIsLoadingLocation(true);

  const tryGeolocation = (attempt = 1) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: [number, number] = [latitude, longitude];
          setUserLocation(newLocation);
          const displayName = await getAddressFromCoordinates(latitude, longitude);
          setAddress(displayName);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error(`Attempt ${attempt} failed:`, error);
          if (attempt < 3) {
            setTimeout(() => tryGeolocation(attempt + 1), 2000); // retry after 2s
          } else {
            setUserLocation(DEFAULT_CENTER);
            setAddress('Maharashtra, India (Approximate)');
            setIsLoadingLocation(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setUserLocation(DEFAULT_CENTER);
      setAddress('Geolocation not supported');
      setIsLoadingLocation(false);
    }
  };

  tryGeolocation();
}, []);


  const handleLocateUser = () => {
    getCurrentLocation();
  };

  const handleMarkerDragEnd = async (tree: Tree, newLat: number, newLng: number) => {
    try {
      const newH3Index = latLngToCell(newLat, newLng, 15);
      const locationUpdate = {
        location: {
          lat: newLat,
          lng: newLng,
          h3Index: newH3Index,
          address: tree.location.address
        }
      };

      await updateTree(tree.id, locationUpdate);

      const displayName = await getAddressFromCoordinates(newLat, newLng);
      await updateTree(tree.id, {
        location: {
          ...locationUpdate.location,
          address: displayName
        }
      });
    } catch (error) {
      console.error('Error updating tree location:', error);
      alert('Failed to update tree location.');
    } finally {
      setDraggedTreeId(null);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    setShowLocationPopup(true);
  };

  const handleLocationPopupClose = () => {
    setShowLocationPopup(false);
    setClickedLocation(null);
  };

  const handleTagTreeAtLocation = (location: { lat: number; lng: number }) => {
    setShowLocationPopup(false);
    setClickedLocation(location);
    setShowTreeForm(true);
  };
  const handleTreeFormSubmit = async (data: any, location: { lat: number; lng: number }) => {
    try {
      await addTree(data, location);
      setShowTreeForm(false);
      setClickedLocation(null);
    } catch (error) {
      console.error('Failed to add tree:', error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full" style={{ height: '100vh' }}>
          <MapContainer
            center={userLocation || DEFAULT_CENTER}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url={
                isSatelliteView
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
              attribution={isSatelliteView ? '© Esri' : '© OpenStreetMap contributors'}
            />

            <MapUpdater center={userLocation || DEFAULT_CENTER} mapInstance={mapInstance} setMapInstance={setMapInstance} />
            <MapClickHandler onMapClick={handleMapClick} />

            {userLocation && <UserLocationMarker position={userLocation} address={address} />}

            {trees.map((tree) => (
              <TreeMarker
                key={`tree-${tree.id}`}
                tree={tree}
                onTreeClick={onTreeClick}
                onDragEnd={handleMarkerDragEnd}
                isDragging={draggedTreeId === tree.id}
                onDragStart={() => setDraggedTreeId(tree.id)}
              />


            ))}
          </MapContainer>
      </div>

      <SatelliteToggle isSatelliteView={isSatelliteView} onToggle={onSatelliteToggle || (() => {})} />

      <MapControls
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

      <LocationPopup
        location={clickedLocation}
        onClose={handleLocationPopupClose}
        onTagTree={handleTagTreeAtLocation}
      />

      <Dialog open={showTreeForm} onOpenChange={setShowTreeForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
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
