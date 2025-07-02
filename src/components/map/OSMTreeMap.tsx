import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Tree } from '@/types/tree';
import { useTree } from '@/contexts/TreeContext';
import MapControls from './MapControls';
import MapSettings from './MapSettings';
import UserLocationMarker from './UserLocationMarker';
import TreeMarker from './TreeMarker';
import MapUpdater from './MapUpdater';
import SatelliteToggle from './SatelliteToggle';
import TreeForm from '@/components/tree/TreeForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { latLngToCell } from 'h3-js';
import { OSMTreeMapProps } from '@/types/map';
import { dragIcon } from './TreeMapIcons';
import LocationPopup from './LocationPopup';
import { Button } from '@/components/ui/button';

const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

const DEFAULT_CENTER: [number, number] = [19.0760, 72.8774];

const MapClickListener = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const OSMTreeMap = ({
  trees,
  onTreeClick,
  onCameraClick,
  isSatelliteView = false,
  onSatelliteToggle
}: OSMTreeMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [address, setAddress] = useState<string>('Click "Locate Me" to detect location');
  const [draggedTreeId, setDraggedTreeId] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const { updateTree, addTree } = useTree();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showTreeForm, setShowTreeForm] = useState(false);

  // Handle map click: show marker and location popup
  const handleMapClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    setShowLocationPopup(true);
    setShowTreeForm(false);
  };

  // When user clicks "Tag Tree" in the popup
  const handleTagTree = () => {
    setShowLocationPopup(false);
    setShowTreeForm(true);
  };

  // When user closes the location popup
  const handleCloseLocationPopup = () => {
    setShowLocationPopup(false);
    setClickedLocation(null);
    setShowTreeForm(false);
  };

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

  useEffect(() => {
    tryGeolocation();
    // eslint-disable-next-line
  }, []);

  const tryGeolocation = async (attempt = 1) => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      try {
        const position = await new Promise<any>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [latitude, longitude];
        setUserLocation(newLocation);
        try {
          const displayName = await getAddressFromCoordinates(latitude, longitude);
          setAddress(displayName);
        } catch (error) {
          console.error('Error getting address:', error);
        }
        setIsLoadingLocation(false);
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          setTimeout(() => tryGeolocation(attempt + 1), 2000);
        } else {
          getDefaultLocationBasedOnIP();
        }
      }
    } else {
      getDefaultLocationBasedOnIP();
    }
  };

  const getDefaultLocationBasedOnIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const { latitude, longitude } = data;
      const newLocation: [number, number] = [latitude, longitude];
      setUserLocation(newLocation);
      try {
        const displayName = await getAddressFromCoordinates(latitude, longitude);
        setAddress(displayName);
      } catch (error) {
        console.error('Error getting address:', error);
      }
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Error getting default location:', error);
      setUserLocation(DEFAULT_CENTER);
      setAddress('Maharashtra, India (Approximate)');
      setIsLoadingLocation(false);
    }
  };

  const handleLocateUser = () => {
    tryGeolocation();
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
    <div className="relative w-full h-full overflow-hidden" style={{ height: '100vh' }}>
      {/* Map */}
      <div className="w-full h-full">
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
          <MapClickListener onClick={handleMapClick} />

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

          {/* Draggable marker for tagging and location popup */}
          {clickedLocation && !showTreeForm && (
            <Marker
              position={[clickedLocation.lat, clickedLocation.lng]}
              draggable={true}
              icon={dragIcon}
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  setClickedLocation({ lat: pos.lat, lng: pos.lng });
                }
              }}
            >
              <Popup>
                <div className="space-y-2 text-sm bg-white rounded-lg shadow-lg p-2">
                  <p>🎯 Drag to adjust tree location</p>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocationPopup(true);
                    }}
                  >
                    Show Location Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          )}


          {/* Tree tagging dialog */}
          {clickedLocation && showTreeForm && (
            <Dialog open={showTreeForm} onOpenChange={setShowTreeForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[9999]">
                <TreeForm
                  onSubmit={handleTreeFormSubmit}
                  onClose={() => {
                    setShowTreeForm(false);
                    setClickedLocation(null);
                  }}
                  initialLocation={clickedLocation}
                />
              </DialogContent>
            </Dialog>
          )}
        </MapContainer>
        
          {/* LocationPopup at the bottom */}
          {clickedLocation && showLocationPopup && !showTreeForm && (
            <LocationPopup
              location={clickedLocation}
              onClose={handleCloseLocationPopup}
              onTagTree={handleTagTree}
            />
          )}
      </div>

      {/* Top-right controls: Satellite toggle and settings */}
      <div className="absolute top-4 right-4 z-50 flex flex-col space-y-3 items-end pointer-events-none">
        <div className="pointer-events-auto">
          <SatelliteToggle isSatelliteView={isSatelliteView} onToggle={onSatelliteToggle || (() => {})} />
        </div>
       
        <MapSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          trees={trees}
          address={address}
        />
      </div>

      {/* Bottom-right: User location button */}
      <div className="absolute bottom-6 right-4 z-50 pointer-events-auto">
        <MapControls
          onSettingsClick={() => setShowSettings(true)}
          onLocateClick={handleLocateUser}
          isLocating={isLoadingLocation}
        />
      </div>
    </div>
  );
};

export default OSMTreeMap;