
import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, TreePine, Camera } from 'lucide-react';

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
    },
    extension: {
      color: '#7c3aed', // violet-600
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
    },
    ngo: {
      color: '#ea580c', // orange-600
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
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

  const handleClick = () => {
    onTreeClick(tree);
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames = {
      farm: 'Farm Forestry',
      community: 'Community Forestry',
      nursery: 'Nursery',
      extension: 'Extension Forestry',
      ngo: 'NGO Partnership'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      farm: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      community: 'bg-blue-100 text-blue-800 border-blue-200',
      nursery: 'bg-red-100 text-red-800 border-red-200',
      extension: 'bg-violet-100 text-violet-800 border-violet-200',
      ngo: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Marker
      key={`tree-${tree.id}-${tree.location.lat}-${tree.location.lng}-${tree.location.h3Index}`}
      position={[tree.location.lat, tree.location.lng]}
      icon={createTreeIcon(tree.category, tree.isVerified)}
      draggable={true}
      eventHandlers={{
        click: handleClick,
        dragstart: onDragStart,
        dragend: handleDragEnd
      }}
    >
      <Popup>
        <div className="bg-white rounded-lg shadow-sm border-0 p-0 w-80 max-w-sm">
          {/* Tree Photo Header */}
          {tree.photos?.tree ? (
            <div className="relative h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-t-lg overflow-hidden">
              <img 
                src={tree.photos.tree} 
                alt={tree.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-t-lg flex items-center justify-center">
              <TreePine className="h-12 w-12 text-white opacity-80" />
            </div>
          )}
          
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Header with Name and Badges */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{tree.name}</h3>
                  <p className="text-sm text-gray-600 italic truncate">{tree.scientificName}</p>
                  {tree.localName && (
                    <p className="text-sm text-blue-600 truncate">{tree.localName}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  {tree.isVerified && (
                    <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                      ✓ Verified
                    </Badge>
                  )}
                  {tree.isAIGenerated && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs px-2 py-1">
                      🤖 AI
                    </Badge>
                  )}
                </div>
              </div>

              {/* Category Badge */}
              <Badge className={`text-xs px-3 py-1 ${getCategoryColor(tree.category)}`}>
                {getCategoryDisplayName(tree.category)}
              </Badge>
            </div>

            {/* Location Information Card */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Geolocation Details</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">GPS Coordinates</p>
                  <p className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-800">
                    {tree.location.lat.toFixed(8)}, {tree.location.lng.toFixed(8)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-600 mb-1">H3 Index (Resolution 15)</p>
                  <p className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-800 break-all">
                    {tree.location.h3Index}
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    Precision: ~0.895 m² area
                  </p>
                </div>

                {tree.location.address && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Address</p>
                    <p className="text-xs text-gray-700 bg-white px-2 py-1 rounded border">
                      {tree.location.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tagging Information */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Tagged by: {tree.taggedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{tree.taggedAt.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status Indicator */}
            {isDragging && (
              <div className="text-xs text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                🔄 Updating location...
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default TreeMarker;
