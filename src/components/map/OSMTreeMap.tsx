import React, { useEffect, useState, useCallback } from 'react';
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
import { MapPin } from 'lucide-react';
// import ProfileView from '../profile/ProfileView'; // REMOVE THIS IMPORT, it's now a separate route
import { useNavigate } from 'react-router-dom'; // IMPORT useNavigate

// Define the Nominatim API URL for reverse geocoding
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}';
const IPAPI_API_URL = 'https://ipapi.co/json/';

const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(NOMINATIM_API_URL.replace('{lat}', lat.toString()).replace('{lon}', lng.toString()));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
        console.error('Error fetching address from Nominatim:', error);
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`; // Fallback to coordinates
    }
};

const DEFAULT_CENTER: [number, number] = [19.0760, 72.8774]; // Mumbai, India

// MapClickListener component: Handles map clicks
const MapClickListener = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const OSMTreeMap = ({
    trees,
    onTreeClick,
    onCameraClick,
    isSatelliteView = false,
    onSatelliteToggle,
}: OSMTreeMapProps) => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [address, setAddress] = useState<string>('Click "Locate Me" or map to detect location');
    const [draggedTreeId, setDraggedTreeId] = useState<string | null>(null);
    const [mapInstance, setMapInstance] = useState<any>(null); // Leaflet Map instance
    const { updateTree, addTree } = useTree();
    const [showLocationPopup, setShowLocationPopup] = useState(false);
    const [showTreeForm, setShowTreeForm] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Memoize address fetching for efficiency and to avoid unnecessary re-renders
    const updateAddress = useCallback(async (lat: number, lng: number) => {
        try {
            const displayName = await getAddressFromCoordinates(lat, lng);
            setAddress(displayName);
        } catch (error) {
            console.error('Error getting address:', error);
            setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)} (Address not found)`);
        }
    }, []);

    // Handle map click: show marker and location popup
    const handleMapClick = useCallback(async (lat: number, lng: number) => {
        setClickedLocation({ lat, lng });
        setShowLocationPopup(true);
        setShowTreeForm(false);
        await updateAddress(lat, lng);
    }, [updateAddress]);

    // When user clicks "Tag Tree" in the popup
    const handleTagTree = useCallback(() => {
        setShowLocationPopup(false);
        setShowTreeForm(true);
    }, []);

    // When user closes the location popup
    const handleCloseLocationPopup = useCallback(() => {
        setShowLocationPopup(false);
        setClickedLocation(null);
        setShowTreeForm(false);
    }, []);

    const handleCompleteView = useCallback(() => {
        // Use navigate to go to the new /profile route
        navigate('/profile');
    }, [navigate]); // Add navigate to dependencies


    // Effect for navigating to location (external event listener)
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

    // Geolocation attempt logic
    const tryGeolocation = useCallback(async (attempt = 1) => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    });
                });
                const { latitude, longitude } = position.coords;
                const newLocation: [number, number] = [latitude, longitude];
                setUserLocation(newLocation);
                await updateAddress(latitude, longitude);
                setIsLoadingLocation(false);
            } catch (error) {
                console.error(`Geolocation Attempt ${attempt} failed:`, error);
                if (attempt < 3) {
                    setTimeout(() => tryGeolocation(attempt + 1), 2000);
                } else {
                    getDefaultLocationBasedOnIP();
                }
            }
        } else {
            getDefaultLocationBasedOnIP();
        }
    }, [updateAddress]);

    // Fallback to IP-based location
    const getDefaultLocationBasedOnIP = useCallback(async () => {
        try {
            const response = await fetch(IPAPI_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const { latitude, longitude } = data;
            const newLocation: [number, number] = [latitude, longitude];
            setUserLocation(newLocation);
            await updateAddress(latitude, longitude);
            setIsLoadingLocation(false);
        } catch (error) {
            console.error('Error getting default location from IP API:', error);
            setUserLocation(DEFAULT_CENTER);
            setAddress('Mumbai, India (Approximate)');
            setIsLoadingLocation(false);
        }
    }, [updateAddress]);

    // Initial geolocation attempt on component mount
    useEffect(() => {
        tryGeolocation();
    }, [tryGeolocation]);

    const handleLocateUser = useCallback(() => {
        tryGeolocation();
    }, [tryGeolocation]);

    // Handle tree marker drag end
    const handleMarkerDragEnd = async (tree: Tree, newLat: number, newLng: number) => {
        try {
            const newH3Index = latLngToCell(newLat, newLng, 15);
            const displayName = await getAddressFromCoordinates(newLat, newLng);

            const locationUpdate = {
                location: {
                    lat: newLat,
                    lng: newLng,
                    h3Index: newH3Index,
                    address: displayName,
                },
            };

            await updateTree(tree.id, locationUpdate);
        } catch (error) {
            console.error('Error updating tree location:', error);
            alert('Failed to update tree location.');
        } finally {
            setDraggedTreeId(null);
        }
    };

    // Handle tree form submission (for adding new trees)
    const handleTreeFormSubmit = async (data: any, location: { lat: number; lng: number }) => {
        try {
            await addTree(data, location);
            setShowTreeForm(false);
            setClickedLocation(null);
        } catch (error) {
            console.error('Failed to add tree:', error);
            alert('Failed to add tree. Please try again.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            {/* Conditional rendering for ProfileView is REMOVED here */}
            {/* Instead, the router handles rendering ProfileView on a different path */}

            <>
                {/* Left Sidebar */}
                {/* <div className="relative custom-corner-shadow w-[280px] h-[634px] bg-soil dark:bg-[#1e1e1b] z-40 p-4 inset-y-0 "> */}
                  <div className= "relative inset-4 bottom-0 w- w-[280px] h-[634px] bg-forest rounded-tl-3xl z-40 p-8 overflow-y-auto flex flex-col space-6">
                    {/* Header */}
                    <h2 className="text-xl font-bold text-[#99a4a8] dark:text-gray-200">Area Details</h2>

                    {/* Address */}
                    <div className="flex items-start space-x-2 p-4">
                        <MapPin className="h-12 w-12 text-lightgrey" />
                        <p className="text-md text-[#b09f02] dark:text-gray-300 leading-snug">{address}</p>
                    </div>

                    {/* Coordinates */}
                    {userLocation && (
                        <div className="text-sm text-lightgrey dark:text-gray-400 space-y-1 p-4">
                            <p>Latitude: <span className="font-medium">{userLocation[0].toFixed(5)}</span></p>
                            <p>Longitude: <span className="font-medium">{userLocation[1].toFixed(5)}</span></p>
                        </div>
                    )}

                    {/* Optional Action Button */}
                    <div className="mt-auto pt-4">
                        <Button
                            className="w-full bg-meadow hover:bg-green-700 text-white rounded-xl shadow-md"
                            onClick={handleCompleteView} // This will now navigate
                        >
                            View Full Report
                        </Button>
                    </div>
                </div>
                {/* </div> */}

                {/* Map Container */}
                <div className="absolute inset-y-4 right-4 bottom-0 w-[calc(100%-300px)] h-screen rounded-tr-3xl overflow-hidden shadow-200px">
                    <MapContainer
                        center={userLocation || DEFAULT_CENTER}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                        whenCreated={setMapInstance}
                    >
                        <TileLayer
                            url={
                                isSatelliteView
                                    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            }
                            attribution={isSatelliteView ? '© Esri' : '© OpenStreetMap contributors'}
                        />

                        <MapUpdater center={userLocation || DEFAULT_CENTER} mapInstance={mapInstance} />
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

                        {clickedLocation && !showTreeForm && (
                            <Marker
                                position={[clickedLocation.lat, clickedLocation.lng]}
                                draggable={true}
                                icon={dragIcon}
                                eventHandlers={{
                                    dragend: (e) => {
                                        const pos = e.target.getLatLng();
                                        setClickedLocation({ lat: pos.lat, lng: pos.lng });
                                        setShowLocationPopup(true);
                                    },
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
                    </MapContainer>

                    {clickedLocation && showLocationPopup && !showTreeForm && (
                        <LocationPopup
                            location={clickedLocation}
                            onClose={handleCloseLocationPopup}
                            onTagTree={handleTagTree}
                        />
                    )}

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

                    {/* Top-right controls: Satellite toggle and settings */}
                    <div className="absolute top-4 right-4 z-50 flex flex-col space-y-3 items-end pointer-events-none">
                        <div className="pointer-events-auto">
                            <SatelliteToggle isSatelliteView={isSatelliteView} onToggle={onSatelliteToggle || (() => {})} />
                        </div>
                        {/* <div className="pointer-events-auto">
                            <Button
                                size="icon"
                                className="rounded-full shadow-md bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                onClick={() => setShowSettings(true)}
                            >
                                ⚙️
                            </Button>
                        </div> */}
                    </div>

                    {/* MapSettings Dialog (rendered conditionally) */}
                    {/* <MapSettings
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                        trees={trees}
                        address={address}
                    /> */}

                    {/* Bottom-right: User location button */}
                    <div className="absolute bottom-6 right-4 z-50 pointer-events-auto">
                        <MapControls
                            onLocateClick={handleLocateUser}
                            isLocating={isLoadingLocation}
                        />
                    </div>
                </div>
            </>
        </div>
    );
};

export default OSMTreeMap;