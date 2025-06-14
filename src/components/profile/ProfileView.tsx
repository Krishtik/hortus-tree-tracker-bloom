
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, TreePine, Award, TrendingUp, Users } from 'lucide-react';

const ProfileView = () => {
  const { user } = useAuth();
  const { trees } = useTree();
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    { label: 'Trees Logged', value: trees.length, icon: TreePine, color: 'text-green-600' },
    { label: 'Areas Mapped', value: 5, icon: MapPin, color: 'text-blue-600' },
    { label: 'Days Active', value: 42, icon: Calendar, color: 'text-purple-600' },
    { label: 'Achievements', value: 3, icon: Award, color: 'text-orange-600' }
  ];

  const achievements = [
    { name: 'First Tree Logger', description: 'Logged your first tree', earned: true },
    { name: 'Urban Explorer', description: 'Mapped 5 different areas', earned: true },
    { name: 'Green Thumb', description: 'Logged 10 trees', earned: false },
    { name: 'Forest Guardian', description: 'Logged 100 trees', earned: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {user?.name || 'Tree Mapper'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active Mapper
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Contributor
                </Badge>
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Navigation */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 px-6">
            {['overview', 'achievements', 'activity'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeSection === section
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Your latest tree mapping activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trees.slice(0, 3).map((tree, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700">
                      <div className="w-2 h-2 bg-green-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Logged: {tree.species || 'Unknown Species'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(tree.dateLogged).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Community Impact</span>
                </CardTitle>
                <CardDescription>Your contribution to the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Community Rank</span>
                    <Badge variant="secondary">#12 Contributor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Trees This Month</span>
                    <span className="font-semibold">{trees.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-6 border transition-all duration-200 hover:shadow-md ${
                  achievement.earned
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 flex items-center justify-center ${
                    achievement.earned ? 'bg-green-500' : 'bg-gray-400'
                  } text-white`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      achievement.earned ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'activity' && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Your tree logging history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trees.map((tree, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-500 mt-2"></div>
                    <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-4 pb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Tree Logged: {tree.species || 'Unknown Species'}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tree.dateLogged).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Location: {tree.location.lat.toFixed(4)}, {tree.location.lng.toFixed(4)}
                      </p>
                      {tree.healthStatus && (
                        <Badge variant="secondary" className="mt-2">
                          Health: {tree.healthStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
