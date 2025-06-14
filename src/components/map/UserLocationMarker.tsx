
import { Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';

interface UserLocationMarkerProps {
  position: [number, number];
  address: string;
}

// User location icon
const createUserIcon = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [0, -32],
    shadowSize: [32, 32]
  });
};

const UserLocationMarker = ({ position, address }: UserLocationMarkerProps) => {
  return (
    <Marker position={position} icon={createUserIcon()}>
      <Popup>
        <div className="text-center max-w-xs">
          <strong className="text-green-800">Your Location</strong>
          <br />
          <small className="text-xs text-muted-foreground">
            {address}
          </small>
          <br />
          <small className="text-xs">Lat: {position[0].toFixed(6)}</small>
          <br />
          <small className="text-xs">Lng: {position[1].toFixed(6)}</small>
        </div>
      </Popup>
    </Marker>
  );
};

export default UserLocationMarker;
