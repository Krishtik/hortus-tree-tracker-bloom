
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, ExternalLink } from 'lucide-react';

const MapboxSettings = () => {
  const [token, setToken] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('mapbox_token', token);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Reload the page to apply the new token
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Mapbox Configuration
        </CardTitle>
        <CardDescription>
          Configure your Mapbox access token for map functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To use the map features, you need a Mapbox access token. Get one free at{' '}
            <Button variant="link" className="p-0 h-auto" asChild>
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer">
                mapbox.com
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
          <Input
            id="mapbox-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGJt..."
          />
          <p className="text-xs text-muted-foreground">
            Your token will be stored locally and is required for map functionality
          </p>
        </div>

        <Button onClick={handleSave} disabled={!token} className="w-full">
          {saved ? 'Saved!' : 'Save Token'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔒 Tokens are stored locally in your browser</p>
          <p>🆓 Mapbox offers generous free tier limits</p>
          <p>📍 Required for H3 geospatial mapping features</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxSettings;
