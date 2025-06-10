
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, MapPin, Camera, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TreeFormData } from '@/types/tree';
import { aiService, TreeIdentificationResult } from '@/services/aiService';
import CameraCapture from '@/components/camera/CameraCapture';

interface TreeFormProps {
  onSubmit: (data: TreeFormData, location: { lat: number; lng: number }) => void;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number };
  capturedPhoto?: File | null;
}

const TreeForm = ({ onSubmit, onClose, initialLocation, capturedPhoto }: TreeFormProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [aiResult, setAiResult] = useState<TreeIdentificationResult | null>(null);
  const [photos, setPhotos] = useState<{ [key: string]: File }>({});
  const [location, setLocation] = useState(initialLocation || { lat: 0, lng: 0 });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<TreeFormData>({
    defaultValues: {
      category: 'farm'
    }
  });

  useEffect(() => {
    // Get current location if not provided
    if (!initialLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to New Delhi, India
          setLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, [initialLocation]);

  useEffect(() => {
    // Process captured photo from TreeScanModal
    if (capturedPhoto) {
      setPhotos(prev => ({ ...prev, tree: capturedPhoto }));
      handleAIIdentification(capturedPhoto);
    }
  }, [capturedPhoto]);

  const handleAIIdentification = async (imageFile: File) => {
    setIsIdentifying(true);
    try {
      console.log('Starting AI identification for:', imageFile.name);
      const result = await aiService.identifyTree(imageFile);
      console.log('AI identification result:', result);
      
      setAiResult(result);
      
      // Auto-fill form with AI results
      setValue('name', result.commonName);
      setValue('scientificName', result.scientificName);
      if (result.localName) {
        setValue('localName', result.localName);
      }
      
      console.log('Form auto-filled with AI data');
    } catch (error) {
      console.error('AI identification failed:', error);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handlePhotoCapture = async (imageFile: File) => {
    console.log('Photo captured:', imageFile.name);
    setShowCamera(false);
    setPhotos(prev => ({ ...prev, tree: imageFile }));
    
    // Try to identify the tree using AI
    await handleAIIdentification(imageFile);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, photoType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name, 'for type:', photoType);
      setPhotos(prev => ({ ...prev, [photoType]: file }));
      
      // If it's the main tree photo, run AI identification
      if (photoType === 'tree') {
        await handleAIIdentification(file);
      }
    }
  };

  const handleFormSubmit = (data: TreeFormData) => {
    console.log('Submitting form with data:', data);
    const formData = {
      ...data,
      photos: photos as any
    };
    onSubmit(formData, location);
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Tag New Tree</h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {/* Location Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          </p>
        </CardContent>
      </Card>

      {/* Photo Capture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Tree Photos
          </CardTitle>
          <CardDescription>
            Take or upload photos for AI identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowCamera(true)}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take Photo
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'tree')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="lg" className="w-full">
                <Upload className="h-5 w-5 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Show captured/uploaded photo */}
          {photos.tree && (
            <div className="text-center">
              <div className="inline-block bg-green-100 px-3 py-1 rounded-full text-sm text-green-800">
                ✓ Main photo captured
              </div>
            </div>
          )}

          {/* Additional photo uploads */}
          <div className="grid grid-cols-2 gap-2">
            {['leaves', 'bark', 'fruit', 'flower'].map((photoType) => (
              <div key={photoType} className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, photoType)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" className="w-full">
                  {photos[photoType] ? '✓' : '+'} {photoType}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Identification Results */}
      {isIdentifying && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Identifying tree with AI...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {aiResult && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Sparkles className="h-5 w-5 mr-2" />
              AI Identification Result
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Confidence: {(aiResult.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{aiResult.commonName}</p>
              <p className="text-sm text-muted-foreground">{aiResult.scientificName}</p>
              {aiResult.localName && (
                <p className="text-sm text-blue-600">{aiResult.localName}</p>
              )}
            </div>
            
            {aiResult.uses.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Uses:</p>
                <div className="flex flex-wrap gap-1">
                  {aiResult.uses.map((use, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tree Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Common Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Common name is required' })}
                  placeholder="e.g., Mango Tree"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="scientificName">Scientific Name *</Label>
                <Input
                  id="scientificName"
                  {...register('scientificName', { required: 'Scientific name is required' })}
                  placeholder="e.g., Mangifera indica"
                />
                {errors.scientificName && (
                  <p className="text-sm text-red-600 mt-1">{errors.scientificName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="localName">Local Name</Label>
                <Input
                  id="localName"
                  {...register('localName')}
                  placeholder="e.g., आम का पेड़"
                />
              </div>

              <div>
                <Label htmlFor="category">Forestry Category *</Label>
                <Select onValueChange={(value) => setValue('category', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm">Farm Forestry</SelectItem>
                    <SelectItem value="community">Community Forestry</SelectItem>
                    <SelectItem value="nursery">Nursery Forestry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="height">Height (meters)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="e.g., 5.5"
                />
              </div>

              <div>
                <Label htmlFor="trunkWidth">Trunk Width (cm)</Label>
                <Input
                  id="trunkWidth"
                  type="number"
                  step="0.1"
                  {...register('trunkWidth', { valueAsNumber: true })}
                  placeholder="e.g., 25.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional observations about the tree..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving Tree...
              </>
            ) : (
              'Save Tree'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TreeForm;
