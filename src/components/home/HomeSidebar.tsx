import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeSidebar = () => {
  // Replace with real data from context or props
  const locationInfo = { address: "Mumbai, India", lat: 19.076, lng: 72.877 };
  const totalNearbyTrees = 42;

  return (
    <aside className="home-side-bar">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Area Details</h2>
        <div className="flex items-center space-x-3 mb-2 bg-[#8eb69b]/20 p-6 rounded-1xl">
          <MapPin className="w-7 h-7 text-[#C2A600]" />
          <span className="font-semibold">{locationInfo.address}</span>
        </div>
        <div className="text-sm text-gray bg-[#8eb69b]/20 p-6 ">
          Lat: {locationInfo.lat}<br />
          Lng: {locationInfo.lng}
        </div>
      </div>
      <div>
        {/* <h3 className="font-semibold mb-2">Nearby Trees Tagged</h3> */}
        {/* <div className="text-3xl font-bold text-[#C2A600] bg-[#8eb69b]/60 p-6 ">{totalNearbyTrees}</div> */}
      </div>
      <Button className="bg-[#C2A600] text-[#188B6A] font-bold mt-auto">View Full Report</Button>
    </aside>
  );
};

export default HomeSidebar;