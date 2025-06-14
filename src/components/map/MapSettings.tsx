
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tree } from '@/types/tree';

interface MapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  trees: Tree[];
  address: string;
}

const MapSettings = ({ isOpen, onClose, trees, address }: MapSettingsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Map Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              Using OpenStreetMap tiles
            </p>
            <p className="text-xs text-muted-foreground mt-2 dark:text-gray-400">
              No API key required • Free and open source
            </p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">Current Location</p>
            <p className="text-xs text-green-700 dark:text-green-400">{address}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="dark:text-gray-300">Farm Forestry ({trees.filter(t => t.category === 'farm').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="dark:text-gray-300">Community Forestry ({trees.filter(t => t.category === 'community').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="dark:text-gray-300">Nursery Forestry ({trees.filter(t => t.category === 'nursery').length})</span>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground dark:text-gray-400">
            Total Trees: {trees.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapSettings;
