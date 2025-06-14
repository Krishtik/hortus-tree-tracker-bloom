
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  TreePine, 
  MapPin, 
  Calendar, 
  Activity, 
  Settings, 
  Download,
  Share,
  BarChart3,
  Leaf,
  Award
} from 'lucide-react';

const ProfileView = () => {
  const { user, logout } = useAuth();
  const { trees } = useTree();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const stats = {
    totalTrees: trees.length,
    treesThisMonth: trees.filter(tree => {
      // Safely handle createdAt if it exists
      if (!tree.createdAt) return false;
      const treeDate = new Date(tree.createdAt);
      const now = new Date();
      return treeDate.getMonth() === now.getMonth() && treeDate.getFullYear() === now.getFullYear();
    }).length,
    healthyTrees: trees.filter(tree => tree.description?.toLowerCase().includes('healthy')).length,
    locations: new Set(trees.map(tree => tree.location.address)).size
  };

  const recentTrees = trees
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 w-full overflow-x-hidden">
      {/* Profile Header - Mobile Optimized */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-3 w-full">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-sm">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 w-full">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {user?.name || 'Tree Mapper'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 break-all">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      <Award className="w-4 h-4 mr-1" />
                      Environmental Steward
                    </Badge>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview - Mobile Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardContent className="p-4 text-center">
            <TreePine className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalTrees}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Trees</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.treesThisMonth}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.healthyTrees}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Healthy</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardContent className="p-4 text-center">
            <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.locations}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Mobile Optimized */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Leaf className="w-5 h-5 mr-2 text-emerald-600" />
            Recent Trees
          </CardTitle>
          <CardDescription className="text-sm">Your latest tree logging activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTrees.length > 0 ? (
            recentTrees.map((tree) => (
              <div key={tree.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {tree.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {tree.createdAt ? new Date(tree.createdAt).toLocaleDateString() : 'Recently added'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {tree.species || 'Tree'}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6 text-sm">
              No trees logged yet. Start mapping!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions & Export - Mobile Optimized */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Data & Analytics
          </CardTitle>
          <CardDescription className="text-sm">Export and share your tree mapping data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start text-sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Tree Data (CSV)
          </Button>
          
          <Button className="w-full justify-start text-sm" variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Progress Report
          </Button>
          
          <Button className="w-full justify-start text-sm" variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Analytics
          </Button>
          
          <Separator />
          
          <div className="text-center">
            <Button 
              onClick={logout}
              variant="destructive"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
