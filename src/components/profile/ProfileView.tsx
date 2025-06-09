
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTree } from '@/contexts/TreeContext';
import { User, MapPin, Calendar, Award } from 'lucide-react';

const ProfileView = () => {
  const { user, logout } = useAuth();
  const { userTrees } = useTree();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-800">Profile</h1>
        <p className="text-muted-foreground">Manage your account and view achievements</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-lg">{user?.name || user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Member Since</label>
            <p className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userTrees.length}</div>
              <div className="text-sm text-muted-foreground">Trees Tagged</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          Export My Data
        </Button>
        <Button variant="outline" className="w-full">
          Settings
        </Button>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={logout}
        >
          Sign Out
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Gamification and advanced profile features will be implemented in Phase 4
      </div>
    </div>
  );
};

export default ProfileView;
