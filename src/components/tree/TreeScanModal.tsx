
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface TreeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TreeScanModal = ({ isOpen, onClose }: TreeScanModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-green-800">
            Scan Tree
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Use your camera to scan and identify trees with AI assistance
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Open Camera
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Camera and AI features will be implemented in Phase 2
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreeScanModal;
