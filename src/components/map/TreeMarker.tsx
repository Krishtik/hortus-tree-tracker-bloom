
import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { Tree } from '@/types/tree';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, TreePine, Camera } from 'lucide-react';
import { ClipboardCopy } from 'lucide-react';
import { useState } from 'react';

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
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
    <Popup
      className="leaflet-popup-content-wrapper !p-0 !bg-transparent"
      maxWidth={360}
      autoPan={true}
      closeButton={false}
    >
      <div className="relative w-[380px] max-w-[100vw] bg-white rounded-xl shadow-xl p-4 pt-6 text-sm text-gray-800 space-y-3 overflow">
        {/* Profile Image */}
        <div className="absolute -top-14 left-4 w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gray-200 z-10">
          {tree.photos?.tree ? (
            <img
              src={tree.photos.tree}
              alt={tree.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
              <TreePine className="h-6 w-6 text-white opacity-80" />
            </div>
          )}
        </div>


        {/* Tree Info */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-green-800">{tree.name}</h3>
          <p className="text-xs italic text-gray-600">{tree.scientificName}</p>
          {tree.localName && (
            <p className="text-xs text-blue-600">{tree.localName}</p>
          )}
        </div>

        {/* Category Badge */}
        <Badge className={getCategoryColor(tree.category)}>
          {getCategoryDisplayName(tree.category)} forestry
        </Badge>

        {/* Coordinates */}
        <div className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded border">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="font-mono truncate">
            {tree.location.lat.toFixed(6)}, {tree.location.lng.toFixed(6)}
          </span>
          <button
            onClick={() =>
              handleCopy('coords', `${tree.location.lat.toFixed(6)}, ${tree.location.lng.toFixed(6)}`)
            }
            className="text-gray-500 hover:text-green-600"
          >
            {copiedField === 'coords' ? '✅' : <ClipboardCopy className="h-4 w-4" />}
          </button>
        </div>

        {/* H3 Index */}
        <div className="flex flex-col text-xs bg-gray-50 px-2 py-1 rounded border break-all">
          <span className="font-semibold text-gray-600">H3 Index</span>
          <div className="flex justify-between items-center">
            <span className="font-mono">{tree.location.h3Index}</span>
            <button
              onClick={() => handleCopy('h3', tree.location.h3Index)}
              className="text-gray-500 hover:text-green-600"
            >
              {copiedField === 'h3' ? '✅' : <ClipboardCopy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tagging Info */}
        <div className="border-t pt-2 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">Tagged by {tree.taggedBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{tree.taggedAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* AI Badge */}
        {tree.isAIGenerated && (
          <Badge variant="outline" className="w-fit text-[10px]">
            🤖 AI Generated
          </Badge>
        )}
      </div>
    </Popup>



    </Marker>
  );
};

export default TreeMarker;
