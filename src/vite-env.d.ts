
/// <reference types="vite/client" />

declare module 'leaflet' {
  interface Icon {
    Default: {
      prototype: {
        _getIconUrl?: () => string;
      };
      mergeOptions: (options: any) => void;
    };
  }
}

declare global {
  interface Navigator {
    geolocation: Geolocation;
  }
}
