
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, MapPin, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTree } from '@/contexts/TreeContext';
import TreeForm from './TreeForm';
import CameraCapture from '@/components/camera/CameraCapture';
import { TreeFormData } from '@/types/tree';
import { aiService } from '@/services/aiService';

interface TreeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TreeScanModal = ({ isOpen, onClose }: TreeScanModalProps) => {
  const [currentView, setCurrentView] = useState<'menu' | 'camera' | 'form' | 'settings'>('menu');
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || '');
  const { addTree } = useTree();

  const handleCameraCapture = (imageFile: File) => {
    console.log('Camera capture in modal:', imageFile.name);
    setCapturedPhoto(imageFile);
    setCurrentView('form');
  };

  const handleFormSubmit = async (data: TreeFormData, formLocation: { lat: number; lng: number }) => {
    try {
      console.log('Submitting tree from modal:', data);
      await addTree(data, formLocation);
      onClose();
      setCurrentView('menu');
      setCapturedPhoto(null);
    } catch (error) {
      console.error('Error saving tree:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentView('menu');
    setCapturedPhoto(null);
  };

  const saveApiKey = () => {
    aiService.setApiKey(apiKey);
    setCurrentView('menu');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'camera':
        return (
          <div className="h-[80vh]">
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setCurrentView('menu')}
            />
          </div>
        );

      case 'form':
        return (
          <TreeForm
            onSubmit={handleFormSubmit}
            onClose={() => setCurrentView('menu')}
            initialLocation={location || undefined}
            capturedPhoto={capturedPhoto}
          />
        );

      case 'settings':
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Settings className="h-12 w-12 mx-auto text-green-600" />
              <h3 className="text-xl font-bold text-green-800">AI Settings</h3>
              <p className="text-muted-foreground text-sm">
                Configure AI services for tree identification
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">AI API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your AI API key for enhanced identification"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use demo mode with mock data
                </p>
              </div>

              <div className="flex space-x-3">
                <Button onClick={saveApiKey} className="flex-1">
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setCurrentView('menu')}>
                  Back
                </Button>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>Demo mode uses mock AI responses for testing.</p>
              <p>Production mode requires valid API keys.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Camera className="h-12 w-12 text-green-600" />
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-800">Scan & Tag Tree</h3>
                <p className="text-muted-foreground">
                  Use AI-powered identification to tag trees with precise location data
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={() => setCurrentView('camera')}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Open Camera & Identify
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  onClick={() => setCurrentView('form')}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Manual Entry
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentView('settings')}
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  AI Settings
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-center text-xs text-muted-foreground">
              <p>📍 GPS location will be automatically captured</p>
              <p>🤖 AI will identify tree species and fill details</p>
              <p>🗺️ H3 geospatial indexing for precise mapping</p>
              <p>🆓 No API keys required - uses OpenStreetMap</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default TreeScanModal;
