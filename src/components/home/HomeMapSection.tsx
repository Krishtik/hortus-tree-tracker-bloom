import React from 'react';
import OSMTreeMap from '@/components/map/OSMTreeMap';

interface HomeMapSectionProps {
  trees: any;
  isSatelliteView: boolean;
  setIsSatelliteView: (val: boolean) => void;
}

const HomeMapSection = ({ trees, isSatelliteView, setIsSatelliteView }) => (
  <main className="flex-1 flex items-center justify-center p-8">
    <div className="w-full h-[80vh] rounded-3xl border-4 border-[#3CB371] bg-white shadow-lg overflow-hidden">
      <OSMTreeMap 
              trees={trees}
        isSatelliteView={isSatelliteView}
        onSatelliteToggle={() => setIsSatelliteView(!isSatelliteView)}
        />
    </div>
  </main> 
);

export default HomeMapSection;