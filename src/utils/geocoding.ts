// src/utils/geocoding.ts but we are using inline function instead of this file in OSMTreeMap file 
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`; // fallback for now
};
