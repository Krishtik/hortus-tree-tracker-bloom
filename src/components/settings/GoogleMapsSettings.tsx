
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, ExternalLink } from 'lucide-react';

const GoogleMapsSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('google_maps_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('google_maps_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Reload the page to apply the new API key
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Google Maps Configuration
        </CardTitle>
        <CardDescription>
          Configure your Google Maps API key for map functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To use the map features, you need a Google Maps API key. Get one free at{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
              <a href="https://developers.google.com/maps/gmp-get-started" target="_blank" rel="noopener noreferrer">
                Google Cloud Console
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="google-maps-key">Google Maps API Key</Label>
          <Input
            id="google-maps-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSyC..."
          />
          <p className="text-xs text-muted-foreground">
            Your API key will be stored locally and is required for map functionality
          </p>
        </div>

        <Button onClick={handleSave} disabled={!apiKey} className="w-full">
          {saved ? 'Saved!' : 'Save API Key'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔒 API keys are stored locally in your browser</p>
          <p>🆓 Google Maps offers $200 monthly credit (free tier)</p>
          <p>📍 Required for H3 geospatial mapping features</p>
          <p>🌍 Enable Maps JavaScript API in Google Cloud Console</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsSettings;
