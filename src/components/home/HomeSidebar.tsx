import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeSidebar = () => {
  // Replace with real data from context or props
  const locationInfo = { address: "Mumbai, India", lat: 19.076, lng: 72.877 };
  const totalNearbyTrees = 42;

  return (
    <aside className="home-side-bar">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Area Details</h2>
        <div className="w-full flex items-center space-x-3 mb-4 bg-[#8eb69b]/20 p-6 rounded-1xl">
          <MapPin className="w-7 h-7 text-[#C2A600]" />
          <span className="font-semibold">{locationInfo.address}</span>
        </div>
        <div className="w-full text-sm text-gray bg-[#8eb69b]/20 p-6 ">
          Lat: {locationInfo.lat}<br />
          Lng: {locationInfo.lng}
        </div>
      </div>
      <div>
        {/* <h3 className="font-semibold mb-2">Nearby Trees Tagged</h3> */}
        {/* <div className="text-3xl font-bold text-[#C2A600] bg-[#8eb69b]/60 p-6 ">{totalNearbyTrees}</div> */}
      </div>
      <Button className="bg-[#8eb69b]/40 text-[#C2A600] font-bold rounded-full hover:bg-[#C2A600]/80 hover:text-[#000000] mt-auto">View Full Report</Button>
    </aside>
  );
};

export default HomeSidebar;