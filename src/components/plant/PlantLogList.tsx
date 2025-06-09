
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Leaf, MapPin, Ruler, Calendar, FileText, Trash2, Edit } from 'lucide-react';

interface PlantEntry {
  id: string;
  species: string;
  commonName: string;
  location: string;
  latitude: string;
  longitude: string;
  height: string;
  diameter: string;
  notes: string;
  plantType: string;
  healthStatus: string;
  timestamp: string;
  userId: string;
}

const PlantLogList = () => {
  const [plants, setPlants] = useState<PlantEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPlants = () => {
    try {
      const storedPlants = localStorage.getItem('krish_hortus_plants');
      if (storedPlants) {
        setPlants(JSON.parse(storedPlants));
      }
    } catch (error) {
      console.error('Error loading plants:', error);
      toast({
        title: "Error",
        description: "Failed to load plant entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();

    // Listen for updates from PlantLogForm
    const handlePlantsUpdated = () => {
      loadPlants();
    };

    window.addEventListener('plantsUpdated', handlePlantsUpdated);
    return () => {
      window.removeEventListener('plantsUpdated', handlePlantsUpdated);
    };
  }, []);

  const deletePlant = (id: string) => {
    try {
      const updatedPlants = plants.filter(plant => plant.id !== id);
      setPlants(updatedPlants);
      localStorage.setItem('krish_hortus_plants', JSON.stringify(updatedPlants));
      
      toast({
        title: "Plant deleted",
        description: "The plant entry has been removed from your collection.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plant entry.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'diseased': return 'bg-red-100 text-red-800 border-red-200';
      case 'recovering': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Loading your plant collection...</p>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">No Plants Logged Yet</h3>
        <p className="text-muted-foreground mb-6">
          Start building your botanical collection by logging your first plant!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Your Plant Collection</h2>
        <p className="text-muted-foreground">
          {plants.length} plant{plants.length !== 1 ? 's' : ''} logged
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => (
          <Card key={plant.id} className="border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <div>
                    <CardTitle className="text-green-800 text-lg">
                      {plant.species || plant.commonName || 'Unknown Plant'}
                    </CardTitle>
                    {plant.species && plant.commonName && (
                      <CardDescription className="text-sm">
                        {plant.commonName}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePlant(plant.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {plant.plantType && (
                  <Badge variant="secondary" className="text-xs">
                    {plant.plantType}
                  </Badge>
                )}
                {plant.healthStatus && (
                  <Badge className={`text-xs ${getHealthStatusColor(plant.healthStatus)}`}>
                    {plant.healthStatus}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {plant.location && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>{plant.location}</span>
                </div>
              )}

              {(plant.latitude && plant.longitude) && (
                <div className="text-xs text-muted-foreground">
                  📍 {parseFloat(plant.latitude).toFixed(4)}, {parseFloat(plant.longitude).toFixed(4)}
                </div>
              )}

              {(plant.height || plant.diameter) && (
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4 text-green-600" />
                  <div className="flex space-x-3">
                    {plant.height && <span>H: {plant.height}m</span>}
                    {plant.diameter && <span>D: {plant.diameter}cm</span>}
                  </div>
                </div>
              )}

              {plant.notes && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {plant.notes.length > 100 
                      ? `${plant.notes.substring(0, 100)}...` 
                      : plant.notes
                    }
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2 border-t border-green-100">
                <Calendar className="h-3 w-3" />
                <span>Logged {formatDate(plant.timestamp)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlantLogList;
