import React, { useState } from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TreeScanModal from '../tree/TreeScanModal';

 const HomeLeftToolBar = () => {
  const [isTreeScanOpen, setIsTreeScanOpen] = useState(false);

  const handleTreeScanToggle = () => {
    setIsTreeScanOpen(prev => !prev);
  };
  return (
  <div className="home-left-toolbar md:w-20 lg:w-24 xl:w-28"> {/* another one can be even made better: w-16 md:w-20 lg:w-24 xl:w-28 flex flex-col items-center justify-center
    bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg; */}
    <Button variant="ghost" className="home-left-tool-bar-button">
      <MessageCircle className="text-yellow-300 w-6 h-6" />
    </Button>
    <Button
      variant="ghost"
      onClick={handleTreeScanToggle}
      className={`home-left-tool-bar-button ${
        isTreeScanOpen ? 'shadow-[0_0_10px_2px_rgba(195,195,195,0.6)]' : ''
      }`}
      >
      <Star className="text-yellow-300 w-6 h-6" />
    </Button>
    {isTreeScanOpen && <TreeScanModal isOpen={isTreeScanOpen} onClose={handleTreeScanToggle} />}
  </div>
);
}

export default HomeLeftToolBar;

// import React, { useState } from 'react';
// import { MessageCircle, Star } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import TreeScanModal from '../tree/TreeScanModal';

// const HomeLeftToolBar = () => {
//   const [isTreeScanOpen, setIsTreeScanOpen] = useState(false);

//   const handleTreeScanToggle = () => {
//     setIsTreeScanOpen(prev => !prev);
//   };

//   return (
//     <div className="home-left-toolbar w-16 md:w-20 lg:w-24 xl:w-28 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
//       <Button variant="ghost" className="home-left-tool-bar-button">
//         <MessageCircle className="text-yellow-300 w-6 h-6" />
//       </Button>

//       <Button
//         variant="ghost"
//         onClick={handleTreeScanToggle}
//         className={`home-left-tool-bar-button ${
//           isTreeScanOpen ? 'shadow-[0_0_10px_2px_rgba(0,255,140,0.6)]' : ''
//         }`}
//       >
//         <Star className="text-yellow-300 w-6 h-6" />
//       </Button>

//       {isTreeScanOpen && <TreeScanModal isOpen={isTreeScanOpen} onClose={handleTreeScanToggle} />}
//     </div>
//   );
// };

// export default HomeLeftToolBar;
