
import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';

interface TreeMarkerProps {
  tree: Tree;
  onTreeClick: (tree: Tree) => void;
  onDragEnd: (tree: Tree, newLat: number, newLng: number) => void;
  isDragging: boolean;
  onDragStart: () => void;
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

const TreeMarker = ({ tree, onTreeClick, onDragEnd, isDragging, onDragStart }: TreeMarkerProps) => {
  const handleDragEnd = (e: any) => {
    const newPosition = e.target.getLatLng();
    onDragEnd(tree, newPosition.lat, newPosition.lng);
  };

  return (
    <Marker
      key={`tree-${tree.id}-${tree.location.lat}-${tree.location.lng}-${tree.location.h3Index}`}
      position={[tree.location.lat, tree.location.lng]}
      icon={createTreeIcon(tree.category)}
      draggable={true}
      eventHandlers={{
        click: () => onTreeClick(tree),
        dragstart: onDragStart,
        dragend: handleDragEnd
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
          {isDragging && (
            <p className="text-xs text-blue-600 font-semibold">🔄 Dragging...</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default TreeMarker;
