
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import { User, MapPin, Calendar, Award, Download, TreePine, Target, TrendingUp } from 'lucide-react';

const ProfileView = () => {
  const { user, logout } = useAuth();
  const { userTrees } = useTree();

  const stats = [
    { label: 'Trees Tagged', value: userTrees.length, icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Locations Visited', value: new Set(userTrees.map(tree => tree.location.h3Index)).size, icon: MapPin, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Species Found', value: new Set(userTrees.map(tree => tree.scientificName)).size, icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Days Active', value: 7, icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  ];

  return (
    <div className="min-h-full p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <User className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <span className="text-white text-xs">🌱</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {user?.name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Tree Conservation Enthusiast</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className={`mx-auto w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Information */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</span>
              <span className="text-gray-900 dark:text-white font-medium">{user?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</span>
              <span className="text-gray-900 dark:text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white font-medium">Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🌱</span>
              </div>
              <div>
                <div className="font-medium text-green-800 dark:text-green-200">First Tree Tagged!</div>
                <div className="text-sm text-green-600 dark:text-green-400">Started your tree mapping journey</div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
              More achievements coming as you explore!
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full h-12 border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-all duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export My Data
        </Button>
        <Button 
          onClick={logout}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <User className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
        <span className="font-medium">Krish Hortus</span> • Advanced features coming in Phase 4
      </div>
    </div>
  );
};

export default ProfileView;
