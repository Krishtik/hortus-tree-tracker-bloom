
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
      const treeDate = new Date(tree.createdAt);
      const now = new Date();
      return treeDate.getMonth() === now.getMonth() && treeDate.getFullYear() === now.getFullYear();
    }).length,
    healthyTrees: trees.filter(tree => tree.notes?.toLowerCase().includes('healthy')).length,
    locations: new Set(trees.map(tree => tree.location.address)).size
  };

  const recentTrees = trees
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {user?.name || 'Tree Mapper'}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      <Award className="w-4 h-4 mr-1" />
                      Environmental Steward
                    </Badge>
                  </div>
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <TreePine className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.totalTrees}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trees</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.treesThisMonth}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.healthyTrees}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Healthy</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.locations}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Locations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Trees
            </CardTitle>
            <CardDescription>Your latest tree logging activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTrees.length > 0 ? (
              recentTrees.map((tree) => (
                <div key={tree.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {tree.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(tree.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {tree.notes?.split(' ')[0] || 'Tree'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No trees logged yet. Start mapping!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions & Export */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Data & Analytics
            </CardTitle>
            <CardDescription>Export and share your tree mapping data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Tree Data (CSV)
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share Progress Report
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
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
    </div>
  );
};

export default ProfileView;
