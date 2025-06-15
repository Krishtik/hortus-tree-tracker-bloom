
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import LandingPage from '@/components/layout/LandingPage';
import OSMTreeMap from '@/components/map/OSMTreeMap';
import TreeDetailModal from '@/components/tree/TreeDetailModal';
import { Tree } from '@/types/tree';

/**
 * Main Index component that handles the application's primary routing
 * Shows landing page for unauthenticated users and the main app for authenticated users
 */
const Index = () => {
  const { isAuthenticated } = useAuth();
  const { trees } = useTree();
  
  // State for selected tree modal
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  // State for satellite view toggle
  const [isSatelliteView, setIsSatelliteView] = useState(false);

  /**
   * Handles tree marker clicks on the map
   * Opens the tree detail modal with the selected tree
   */
  const handleTreeClick = (tree: Tree) => {
    console.log('Tree clicked:', tree.name);
    setSelectedTree(tree);
  };

  /**
   * Handles camera capture functionality
   * Currently logs the action - can be extended for photo capture
   */
  const handleCameraClick = () => {
    console.log('Camera clicked - opening tree form');
    // This can be extended to open camera capture or tree form
  };

  /**
   * Toggles between satellite and street map view
   */
  const handleSatelliteToggle = () => {
    setIsSatelliteView(prev => !prev);
    console.log('Satellite view toggled:', !isSatelliteView);
  };

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show main application for authenticated users
  return (
    <AuthenticatedLayout>
      {/* Main map component with tree markers and controls */}
      <OSMTreeMap 
        trees={trees}
        onTreeClick={handleTreeClick}
        onCameraClick={handleCameraClick}
        isSatelliteView={isSatelliteView}
        onSatelliteToggle={handleSatelliteToggle}
      />
      
      {/* Tree detail modal - shows when a tree is selected */}
      {selectedTree && (
        <TreeDetailModal 
          tree={selectedTree}
          onClose={() => {
            setSelectedTree(null);
            console.log('Tree detail modal closed');
          }}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default Index;
