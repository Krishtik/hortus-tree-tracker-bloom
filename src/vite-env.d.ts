
/// <reference types="vite/client" />

declare module 'leaflet' {
  export interface Icon {
    Default: {
      prototype: {
        _getIconUrl?: () => string;
      };
      mergeOptions: (options: any) => void;
    };
  }

  export function divIcon(options: any): any;
  export function icon(options: any): any;
  
  export namespace Icon {
    const Default: {
      prototype: {
        _getIconUrl?: () => string;
      };
      mergeOptions: (options: any) => void;
    };
  }
}

declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export interface MarkerProps {
    position: [number, number];
    icon?: any;
    children?: React.ReactNode;
    draggable?: boolean;
    eventHandlers?: {
      click?: () => void;
      dragstart?: () => void;
      dragend?: (event: any) => void;
    };
  }

  export interface PopupProps {
    children?: React.ReactNode;
  }

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
  export function useMap(): any;
}

declare global {
  interface Navigator {
    geolocation: Geolocation;
  }
}
