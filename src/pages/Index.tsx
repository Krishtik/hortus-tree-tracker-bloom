
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/auth/AuthModal';
import PlantLogForm from '@/components/plant/PlantLogForm';
import PlantLogList from '@/components/plant/PlantLogList';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, TreePine, Flower } from 'lucide-react';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navigation 
        onAuthClick={() => setShowAuthModal(true)}
        onLogPlantClick={() => setShowLogForm(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          // Landing Page for Non-Authenticated Users
          <div className="text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-center space-x-4 mb-6">
                <Leaf className="h-16 w-16 text-green-600 animate-pulse" />
                <TreePine className="h-16 w-16 text-emerald-600 animate-pulse delay-100" />
                <Flower className="h-16 w-16 text-teal-600 animate-pulse delay-200" />
              </div>
              
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Krish Hortus
              </h1>
              
              <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your personal botanical companion for tracking, identifying, and nurturing your plant collection
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge variant="secondary" className="text-lg px-6 py-2">
                  🌱 Plant Logging
                </Badge>
                <Badge variant="secondary" className="text-lg px-6 py-2">
                  📍 Location Tracking
                </Badge>
                <Badge variant="secondary" className="text-lg px-6 py-2">
                  📊 Growth Analytics
                </Badge>
                <Badge variant="secondary" className="text-lg px-6 py-2">
                  🔍 Species Identification
                </Badge>
              </div>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Garden Journey
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
              <Card className="border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">Smart Plant Logging</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Record detailed information about your plants including species, measurements, location, and growth notes with our intuitive logging system.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <TreePine className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-emerald-800">Growth Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Monitor your plants' progress over time with detailed measurements, photos, and notes to track their health and development.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-teal-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <Flower className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle className="text-teal-800">Personal Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Build your personal plant database with detailed records, photos, and insights about each specimen in your collection.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Dashboard for Authenticated Users
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-green-800">
                Welcome back, {user?.name || user?.email}! 🌿
              </h1>
              <p className="text-xl text-muted-foreground">
                Ready to log some new plants today?
              </p>
              <Button 
                onClick={() => setShowLogForm(true)}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Add New Plant Entry
              </Button>
            </div>

            {/* Plant Log List */}
            <PlantLogList />
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Plant Log Form Modal */}
      {isAuthenticated && (
        <PlantLogForm 
          isOpen={showLogForm} 
          onClose={() => setShowLogForm(false)} 
        />
      )}
    </div>
  );
};

export default Index;
