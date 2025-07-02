const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  const accessToken = 'pk.984de322eafe7ceb4d931f83197bfd24';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const place = data.features?.[0]?.place_name;
    return place || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Mapbox geocoding failed:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
