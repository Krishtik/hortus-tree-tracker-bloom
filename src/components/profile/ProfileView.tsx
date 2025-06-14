
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TreePine, MapPin, Calendar, Award, Target, TrendingUp, Users, Leaf } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProfileView = () => {
  const { user } = useAuth();
  const { trees } = useTree();

  // Calculate stats
  const totalTrees = trees.length;
  const categoryCounts = trees.reduce((acc, tree) => {
    acc[tree.category] = (acc[tree.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mock data for demonstration
  const userStats = {
    treesPlanted: totalTrees,
    carbonOffset: totalTrees * 22, // Rough estimate: 22kg CO2 per tree per year
    badges: ['Tree Hugger', 'Carbon Warrior', 'Green Champion'],
    streak: 7,
    level: Math.floor(totalTrees / 5) + 1,
    nextLevelTrees: 5 - (totalTrees % 5)
  };

  const achievements = [
    { icon: TreePine, title: 'First Tree', description: 'Planted your first tree', completed: totalTrees > 0 },
    { icon: Users, title: 'Community Builder', description: 'Join a tree planting community', completed: false },
    { icon: Target, title: 'Goal Achiever', description: 'Reach your monthly goal', completed: totalTrees >= 10 },
    { icon: Award, title: 'Expert Planter', description: 'Plant 50 trees', completed: totalTrees >= 50 }
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ScrollArea className="h-full w-full">
        <div className="max-w-4xl mx-auto space-y-6 p-4 pb-24">
          
          {/* Profile Header */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-200 dark:ring-emerald-800">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-green-500 text-white text-xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {user?.name || 'Tree Planter'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Environmental Enthusiast • Level {userStats.level}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {userStats.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <TreePine className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.treesPlanted}</div>
                <div className="text-sm opacity-90">Trees Planted</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Leaf className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.carbonOffset}kg</div>
                <div className="text-sm opacity-90">CO₂ Offset</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.level}</div>
                <div className="text-sm opacity-90">Level</div>
              </CardContent>
            </Card>
          </div>

          {/* Trees by Category */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-emerald-600" />
                <span>Your Tree Forest</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{count}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category} Trees</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trees */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Recent Trees</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trees.slice(0, 5).map((tree) => (
                  <div key={tree.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{tree.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{tree.scientificName}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{tree.location.lat.toFixed(4)}, {tree.location.lng.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.completed
                          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`h-8 w-8 ${
                            achievement.completed ? 'text-emerald-600' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {achievement.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfileView;
