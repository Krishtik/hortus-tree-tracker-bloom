
import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';
import { Badge } from '@/components/ui/badge';

interface TreeMarkerProps {
  tree: Tree;
  onTreeClick: (tree: Tree) => void;
  onDragEnd: (tree: Tree, newLat: number, newLng: number) => void;
  isDragging: boolean;
  onDragStart: () => void;
}

// Enhanced custom icon creator for different tree categories
const createTreeIcon = (category: string, isVerified: boolean = false) => {
  const iconConfig = {
    farm: {
      color: '#059669', // emerald-600
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
    },
    community: {
      color: '#2563eb', // blue-600
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
    },
    nursery: {
      color: '#dc2626', // red-600
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
    }
  };
  
  const config = iconConfig[category as keyof typeof iconConfig] || iconConfig.farm;
  
  // Create custom HTML for verified trees
  if (isVerified) {
    const verifiedIcon = L.divIcon({
      html: `
        <div style="position: relative;">
          <img src="${config.iconUrl}" style="width: 25px; height: 41px;" />
          <div style="position: absolute; top: -5px; right: -5px; background: #10b981; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;">✓</div>
        </div>
      `,
      className: 'custom-verified-marker',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
    return verifiedIcon;
  }
  
  return L.icon({
    iconUrl: config.iconUrl,
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

  const getCategoryDisplayName = (category: string) => {
    const categoryNames = {
      farm: 'Farm Forestry',
      community: 'Community Forestry',
      nursery: 'Nursery'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      farm: 'emerald',
      community: 'blue',
      nursery: 'red'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  return (
    <Marker
      key={`tree-${tree.id}-${tree.location.lat}-${tree.location.lng}-${tree.location.h3Index}`}
      position={[tree.location.lat, tree.location.lng]}
      icon={createTreeIcon(tree.category, tree.isVerified)}
      draggable={true}
      eventHandlers={{
        click: () => onTreeClick(tree),
        dragstart: onDragStart,
        dragend: handleDragEnd
      }}
    >
      <Popup className="custom-popup">
        <div className="space-y-3 min-w-[280px] p-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-green-800 dark:text-green-600">{tree.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{tree.scientificName}</p>
              {tree.localName && (
                <p className="text-sm text-blue-600 dark:text-blue-400">{tree.localName}</p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              {tree.isVerified && (
                <Badge variant="default" className="bg-green-500 text-white text-xs">
                  ✓ Verified
                </Badge>
              )}
              {tree.isAIGenerated && (
                <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
                  🤖 AI ID
                </Badge>
              )}
            </div>
          </div>

          <Badge 
            variant="secondary" 
            className={`capitalize text-xs bg-${getCategoryColor(tree.category)}-100 text-${getCategoryColor(tree.category)}-800 dark:bg-${getCategoryColor(tree.category)}-900 dark:text-${getCategoryColor(tree.category)}-100`}
          >
            {getCategoryDisplayName(tree.category)}
          </Badge>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium text-gray-700 dark:text-gray-300">Location Details:</p>
              <p className="font-mono bg-white dark:bg-gray-700 p-1 rounded text-xs break-all">
                H3: {tree.location.h3Index}
              </p>
              <p className="text-green-600 dark:text-green-400 font-medium">
                Precision: ~0.895 m² (Resolution 15)
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                📍 {tree.location.lat.toFixed(8)}, {tree.location.lng.toFixed(8)}
              </p>
            </div>
          </div>

          {(tree.measurements.height || tree.measurements.trunkWidth) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 space-y-1">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Measurements:</p>
              {tree.measurements.height && (
                <p className="text-xs text-blue-700 dark:text-blue-400">📏 Height: {tree.measurements.height}m</p>
              )}
              {tree.measurements.trunkWidth && (
                <p className="text-xs text-blue-700 dark:text-blue-400">🌳 Trunk: {tree.measurements.trunkWidth}cm</p>
              )}
            </div>
          )}

          <div className="border-t pt-2">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              🖱️ Drag marker to update position
            </p>
            {isDragging && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                🔄 Updating location...
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
            <p>Tagged by: {tree.taggedBy}</p>
            <p>Date: {tree.taggedAt.toLocaleDateString()}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default TreeMarker;
