
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/auth/AuthModal';
import { Leaf, TreePine, Flower } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <Navigation 
        onAuthClick={() => setShowAuthModal(true)}
        onLogPlantClick={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8 pb-20">
        {/* Landing Page Content */}
        <div className="text-center space-y-12">
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
              Tag, track, and manage trees with AI-powered identification using advanced geospatial mapping
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🌍 H3 Geospatial Mapping
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🤖 AI Tree Recognition
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                📱 Mobile-First PWA
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🌳 Forestry Categories
              </Badge>
            </div>
            
            <Button 
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Tree Tagging Journey
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            <Card className="border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg dark:border-green-800 dark:hover:border-green-700">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <TreePine className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-800 dark:text-green-200">Farm Forestry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Tag and manage trees in agricultural settings, track growth patterns, and optimize farm forestry practices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg dark:border-blue-800 dark:hover:border-blue-700">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-blue-800 dark:text-blue-200">Community Forestry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Document community forest areas, track biodiversity, and support conservation efforts with precise mapping.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg dark:border-yellow-800 dark:hover:border-yellow-700">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                  <Flower className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Nursery Forestry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Manage nursery operations, track seedling growth, and maintain detailed records of plant propagation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage;
