import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeLeftToolBar = () => (
  <div className="home-left-toolbar"> {/* another one can be even made better: w-16 md:w-20 lg:w-24 xl:w-28 flex flex-col items-center justify-center
    bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg; */}
    <Button variant="ghost" className="bg-[#188B6A] w-12 h-12 rounded-full flex items-center justify-center">
      <MessageCircle className="text-white w-6 h-6" />
    </Button>
    <Button variant="ghost" className="bg-[#188B6A] w-12 h-12 rounded-full flex items-center justify-center">
      <Star className="text-yellow-300 w-6 h-6" />
    </Button>
  </div>
);

export default HomeLeftToolBar;