
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Leaf, MapPin, Ruler, Calendar, FileText } from 'lucide-react';

interface PlantLogFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlantLogForm = ({ isOpen, onClose }: PlantLogFormProps) => {
  const [formData, setFormData] = useState({
    species: '',
    commonName: '',
    location: '',
    latitude: '',
    longitude: '',
    height: '',
    diameter: '',
    notes: '',
    plantType: '',
    healthStatus: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const plantTypes = [
    'Tree', 'Shrub', 'Herb', 'Flower', 'Fern', 'Succulent', 'Vine', 'Grass', 'Moss', 'Other'
  ];

  const healthStatuses = [
    'Excellent', 'Good', 'Fair', 'Poor', 'Diseased', 'Recovering'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new plant entry
      const newEntry = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        timestamp: new Date().toISOString(),
        userId: 'current-user' // In real app, get from auth context
      };

      // Get existing entries or create empty array
      const existingEntries = JSON.parse(localStorage.getItem('krish_hortus_plants') || '[]');
      
      // Add new entry
      const updatedEntries = [newEntry, ...existingEntries];
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('krish_hortus_plants', JSON.stringify(updatedEntries));

      toast({
        title: "Plant logged successfully! 🌱",
        description: `${formData.species || formData.commonName} has been added to your collection.`,
      });

      // Reset form and close modal
      setFormData({
        species: '',
        commonName: '',
        location: '',
        latitude: '',
        longitude: '',
        height: '',
        diameter: '',
        notes: '',
        plantType: '',
        healthStatus: ''
      });
      onClose();
      
      // Trigger a custom event to refresh the plant list
      window.dispatchEvent(new Event('plantsUpdated'));
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log plant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-green-800">
            Log New Plant Entry
          </DialogTitle>
        </DialogHeader>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Plant Information</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Species and Common Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="species" className="text-green-700">Scientific Name</Label>
                  <div className="relative">
                    <Leaf className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                    <Input
                      id="species"
                      placeholder="e.g., Quercus alba"
                      value={formData.species}
                      onChange={(e) => handleInputChange('species', e.target.value)}
                      className="pl-10 border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commonName" className="text-green-700">Common Name</Label>
                  <Input
                    id="commonName"
                    placeholder="e.g., White Oak"
                    value={formData.commonName}
                    onChange={(e) => handleInputChange('commonName', e.target.value)}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Plant Type and Health Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-green-700">Plant Type</Label>
                  <Select onValueChange={(value) => handleInputChange('plantType', value)}>
                    <SelectTrigger className="border-green-200 focus:border-green-400">
                      <SelectValue placeholder="Select plant type" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-green-700">Health Status</Label>
                  <Select onValueChange={(value) => handleInputChange('healthStatus', value)}>
                    <SelectTrigger className="border-green-200 focus:border-green-400">
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-green-700">Location Description</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Input
                    id="location"
                    placeholder="e.g., Central Park, Near main entrance"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-green-700">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7831"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-green-700">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -73.9712"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-green-700">Height (meters)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.5"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="pl-10 border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diameter" className="text-green-700">Diameter (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                    <Input
                      id="diameter"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 45.2"
                      value={formData.diameter}
                      onChange={(e) => handleInputChange('diameter', e.target.value)}
                      className="pl-10 border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-green-700">Notes</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                  <Textarea
                    id="notes"
                    placeholder="Additional observations, care notes, or other relevant information..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400 min-h-[100px]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || (!formData.species && !formData.commonName)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isSubmitting ? 'Logging Plant...' : 'Log Plant Entry'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PlantLogForm;
