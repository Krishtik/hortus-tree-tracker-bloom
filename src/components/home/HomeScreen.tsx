import HomeTopBar from '@/components/home/HomeTopBar.tsx';
import HomeLeftToolBar from '@/components/home/HomeLeftToolBar';
import HomeSidebar from '@/components/home/HomeSidebar';
import HomeMapSection from '@/components/home/HomeMapSection';

const handleNotificationClick = () => {
  console.log('Notification clicked - opening notification panel');
};

const HomeScreen = ({ trees, isSatelliteView, setIsSatelliteView }) => (
  // <div className="min-h-screen w-full flex flex-col bg-[#000000] rounded-tl-[40px] rounded-tr-[40px]">
  <div className = "home-layout">
  <HomeTopBar onNotificationClick={handleNotificationClick} />
  <div className="home-below-top-bar-content">
    <HomeLeftToolBar />
    <HomeSidebar />
    <HomeMapSection
      trees={trees}
      isSatelliteView={isSatelliteView}
      setIsSatelliteView={setIsSatelliteView}
    />
    {/* </div> */}
  </div>
  </div>
);

export default HomeScreen;