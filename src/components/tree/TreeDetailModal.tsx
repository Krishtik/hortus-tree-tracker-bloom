
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tree } from '@/types/tree';
import { MapPin, Calendar, User } from 'lucide-react';

interface TreeDetailModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
}

const TreeDetailModal = ({ tree, isOpen, onClose }: TreeDetailModalProps) => {
  const categoryColors = {
    farm: 'bg-green-100 text-green-800',
    community: 'bg-blue-100 text-blue-800',
    nursery: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-800">
            {tree.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-lg">{tree.scientificName}</h3>
            {tree.localName && (
              <p className="text-muted-foreground">{tree.localName}</p>
            )}
          </div>

          {/* Category Badge */}
          <Badge className={categoryColors[tree.category]}>
            {tree.category} forestry
          </Badge>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {tree.location.lat.toFixed(6)}, {tree.location.lng.toFixed(6)}
            </span>
          </div>

          {/* H3 Index */}
          <div className="text-sm">
            <strong>H3 Index:</strong> {tree.location.h3Index}
          </div>

          {/* Measurements */}
          {(tree.measurements.height || tree.measurements.trunkWidth) && (
            <div>
              <h4 className="font-medium mb-2">Measurements</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {tree.measurements.height && (
                  <div>
                    <span className="text-muted-foreground">Height:</span> {tree.measurements.height}m
                  </div>
                )}
                {tree.measurements.trunkWidth && (
                  <div>
                    <span className="text-muted-foreground">Trunk Width:</span> {tree.measurements.trunkWidth}cm
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Photos */}
          {tree.photos.tree && (
            <div>
              <h4 className="font-medium mb-2">Photos</h4>
              <img 
                src={tree.photos.tree} 
                alt={tree.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Tagged Info */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Tagged by user {tree.taggedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{tree.taggedAt.toLocaleDateString()}</span>
            </div>
          </div>

          {tree.isAIGenerated && (
            <Badge variant="outline" className="w-fit">
              AI Generated
            </Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreeDetailModal;
