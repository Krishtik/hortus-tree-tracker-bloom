
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/auth/AuthModal';
import { Leaf, TreePine, Flower, Camera, MapPin, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Modern landing page component with Instagram/Canva-inspired design
 * Features split-screen layout, gradient backgrounds, and smooth animations
 * Showcases app features and provides elegant authentication flow
 */
const LandingPage = () => {
  // State for controlling authentication modal visibility
  const [showAuthModal, setShowAuthModal] = useState(false);

  /**
   * Opens the authentication modal
   * Triggered by CTA buttons and navigation
   */
  const handleAuthClick = () => {
    setShowAuthModal(true);
    console.log('Authentication modal opened');
  };

  /**
   * Closes the authentication modal
   * Resets modal state when user cancels or completes auth
   */
  const handleAuthClose = () => {
    setShowAuthModal(false);
    console.log('Authentication modal closed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Top navigation with logo and auth button */}
      <Navigation 
        onAuthClick={handleAuthClick}
        onLogPlantClick={() => console.log('Log plant clicked from landing')}
      />
      
      <main className="container mx-auto px-4 py-8 pb-20">
        {/* Hero Section with Modern Design */}
        <div className="text-center space-y-16 max-w-7xl mx-auto">
          
          {/* Primary Hero Content */}
          <div className="space-y-8">
            {/* Animated Icon Group */}
            <div className="flex justify-center space-x-6 mb-8">
              <div className="relative">
                <Leaf className="h-20 w-20 text-green-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-100 rounded-full animate-ping"></div>
              </div>
              <div className="relative">
                <TreePine className="h-20 w-20 text-emerald-600 animate-pulse delay-100" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-100 rounded-full animate-ping delay-100"></div>
              </div>
              <div className="relative">
                <Flower className="h-20 w-20 text-teal-600 animate-pulse delay-200" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 rounded-full animate-ping delay-200"></div>
              </div>
            </div>
            
            {/* Main Heading with Gradient Text */}
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                Krish Hortus
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Tag, track, and manage trees with AI-powered identification using advanced geospatial mapping
              </p>
            </div>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Badge variant="secondary" className="text-lg px-8 py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                <MapPin className="w-5 h-5 mr-2" />
                H3 Geospatial Mapping
              </Badge>
              <Badge variant="secondary" className="text-lg px-8 py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                <Camera className="w-5 h-5 mr-2" />
                AI Tree Recognition
              </Badge>
              <Badge variant="secondary" className="text-lg px-8 py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                <Users className="w-5 h-5 mr-2" />
                Community Driven
              </Badge>
              <Badge variant="secondary" className="text-lg px-8 py-3 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                <Award className="w-5 h-5 mr-2" />
                Verified Data
              </Badge>
            </div>
            
            {/* Primary CTA Button */}
            <div className="pt-8">
              <Button 
                onClick={handleAuthClick}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:rotate-1"
              >
                <TreePine className="w-6 h-6 mr-3" />
                Start Tree Tagging Journey
              </Button>
            </div>
          </div>

          {/* Features Grid with Modern Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mt-24 max-w-7xl mx-auto">
            
            {/* Farm Forestry Card */}
            <Card className="group border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TreePine className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-800 dark:text-green-200 font-semibold">Farm Forestry</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  Tag and manage trees in agricultural settings, track growth patterns, and optimize farm forestry practices with precision mapping.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Community Forestry Card */}
            <Card className="group border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-800 dark:text-blue-200 font-semibold">Community Forestry</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  Document community forest areas, track biodiversity, and support conservation efforts with collaborative mapping.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Nursery Forestry Card */}
            <Card className="group border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-500 hover:shadow-2xl hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Flower className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-2xl text-yellow-800 dark:text-yellow-200 font-semibold">Nursery Forestry</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  Manage nursery operations, track seedling growth, and maintain detailed records of plant propagation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Secondary CTA Section */}
          <div className="mt-24 p-12 rounded-3xl bg-gradient-to-r from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-200/30 dark:border-green-700/30">
            <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Ready to Transform Forestry Management?
            </h2>
            <p className="text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of forestry professionals using AI-powered tree identification and geospatial mapping.
            </p>
            <div className="text-center">
              <Button 
                onClick={handleAuthClick}
                variant="outline"
                size="lg"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-10 py-4 text-lg rounded-xl transition-all duration-300"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthClose} 
      />
    </div>
  );
};

export default LandingPage;
