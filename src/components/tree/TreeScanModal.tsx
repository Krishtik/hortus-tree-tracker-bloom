
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
              <h3 className="text-xl font-bold text-green-800 dark:text-green-400">AI Settings</h3>
              <p className="text-muted-foreground text-sm dark:text-gray-300">
                Configure AI services for enhanced tree identification
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="dark:text-gray-200">AI API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your AI API key for enhanced identification"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
                  Leave empty to use demo mode with enhanced mock data
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

            <div className="text-center text-xs text-muted-foreground dark:text-gray-400">
              <p>Demo mode uses enhanced AI responses with Indian flora data.</p>
              <p>Production mode requires valid API keys for real-time identification.</p>
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
                <h3 className="text-xl font-bold text-green-800 dark:text-green-400">Scan & Tag Tree</h3>
                <p className="text-muted-foreground dark:text-gray-300 px-2">
                  Use enhanced AI-powered identification to tag trees with precise location data and cultural information
                </p>
              </div>
              
              <div className="space-y-3 px-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3 h-12 text-base font-medium rounded-lg"
                  onClick={() => setCurrentView('camera')}
                >
                  <Camera className="h-5 w-5" />
                  Open Camera & Identify
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-3 h-12 text-base font-medium rounded-lg dark:border-gray-600 dark:text-gray-300"
                  onClick={() => setCurrentView('form')}
                >
                  <Upload className="h-5 w-5" />
                  Manual Entry
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('settings')}
                  className="w-full flex items-center justify-center gap-3 h-10 text-sm rounded-lg dark:border-gray-600 dark:text-gray-300"
                >
                  <Settings className="h-4 w-4" />
                  AI Settings
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-center text-xs text-muted-foreground dark:text-gray-400 px-4">
              <p>📍 Enhanced GPS location with Indian region detection</p>
              <p>🤖 AI extracts colors, taxonomy, and Sangam Land records</p>
              <p>🗺️ H3 geospatial indexing for precise mapping</p>
              <p>🌿 Indian flora database with cultural significance</p>
              <p>🆓 No API keys required - uses OpenStreetMap</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default TreeScanModal;
