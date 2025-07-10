import React from 'react';
import OSMTreeMap from '@/components/map/OSMTreeMap';

interface HomeMapSectionProps {
  trees: any;
  isSatelliteView: boolean;
  setIsSatelliteView: (val: boolean) => void;
}

const HomeMapSection = ({ trees, isSatelliteView, setIsSatelliteView }) => (
  <main className="flex-1 flex items-center justify-center bg-[#3d6951] dark:bg-[#292929]">
    <div className="w-full h-[86vh] rounded-2xl border-4 bottom-0 border-[#3CB371] shadow-inner shadow-black overflow-hidden mt-10">
      <OSMTreeMap 
              trees={trees}
        isSatelliteView={isSatelliteView}
        onSatelliteToggle={() => setIsSatelliteView(!isSatelliteView)}
        />
    </div>
  </main> 
);

export default HomeMapSection;