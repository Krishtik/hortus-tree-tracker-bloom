
import { useState, useEffect } from 'react';
import { MapPin, TreePine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { latLngToCell } from 'h3-js';

interface LocationPopupProps {
  location: { lat: number; lng: number } | null;
  onClose: () => void;
  onTagTree: (location: { lat: number; lng: number }) => void;
}

const LocationPopup = ({ location, onClose, onTagTree }: LocationPopupProps) => {
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (location) {
      fetchAddress(location.lat, location.lng);
    }
  }, [location]);

  const fetchAddress = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const geoData = await response.json();
      const addressText = geoData.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(addressText);
    } catch (error) {
      console.error('Failed to get address:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleTagTree = () => {
    if (location) {
      onTagTree(location);
    }
  };

  if (!location) return null;

  const h3Index = latLngToCell(location.lat, location.lng, 9);

  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="rounded-t-xl rounded-b-none border-t border-x-0 border-b-0 max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Location Selected</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                  <p className="text-sm font-mono">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
                
                <Badge variant="outline" className="w-fit">
                  H3: {h3Index.slice(0, 12)}...
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                {isLoadingAddress ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                    <p className="text-sm text-muted-foreground">Loading address...</p>
                  </div>
                ) : (
                  <p className="text-sm">{address}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleTagTree}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <TreePine className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tag Tree at this Location</span>
                <span className="sm:hidden">Tag Tree</span>
              </Button>
              
              <Button variant="outline" onClick={onClose} className="sm:w-auto">
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationPopup;
