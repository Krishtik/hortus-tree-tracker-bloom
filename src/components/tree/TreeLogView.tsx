
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTree } from '@/contexts/TreeContext';
import { Badge } from '@/components/ui/badge';
import { TreePine, Users, Building, Sprout, HandHeart } from 'lucide-react';

const TreeLogView = () => {
  const { userTrees, trees } = useTree();

  // Enhanced category statistics with real data
  const categoryStats = {
    farm: trees.filter(tree => tree.category === 'farm').length,
    community: trees.filter(tree => tree.category === 'community').length,
    nursery: trees.filter(tree => tree.category === 'nursery').length,
  };

  // Extended forestry categories for future implementation
  const extendedCategories = {
    'Farm Forestry': {
      count: categoryStats.farm,
      icon: TreePine,
      color: 'emerald',
      description: 'Trees on agricultural lands'
    },
    'Community Forestry': {
      count: categoryStats.community,
      icon: Users,
      color: 'blue',
      description: 'Public and community spaces'
    },
    'Nursery': {
      count: categoryStats.nursery,
      icon: Sprout,
      color: 'green',
      description: 'Seedlings and propagation'
    },
    'Extension Forestry': {
      count: 0, // Placeholder for future implementation
      icon: Building,
      color: 'purple',
      description: 'Urban and roadside plantations'
    },
    'NGO Collaborations': {
      count: 0, // Placeholder for future implementation
      icon: HandHeart,
      color: 'pink',
      description: 'Partnership projects'
    }
  };

  // Get verified trees count
  const verifiedTrees = trees.filter(tree => tree.isVerified).length;
  const aiGeneratedTrees = trees.filter(tree => tree.isAIGenerated).length;

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-600">Tree Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time forestry management and statistics</p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <TreePine className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{trees.length}</div>
            <div className="text-sm opacity-90">Total Trees</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userTrees.length}</div>
            <div className="text-sm opacity-90">Your Trees</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{verifiedTrees}</div>
            <div className="text-sm opacity-90">Verified</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{aiGeneratedTrees}</div>
            <div className="text-sm opacity-90">AI Identified</div>
          </CardContent>
        </Card>
      </div>

      {/* Forestry Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TreePine className="h-5 w-5 text-emerald-600" />
            <span>Forestry Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(extendedCategories).map(([category, data]) => {
              const Icon = data.icon;
              return (
                <div key={category} className={`bg-${data.color}-50 dark:bg-${data.color}-900/20 border border-${data.color}-200 dark:border-${data.color}-800 rounded-lg p-4`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`h-6 w-6 text-${data.color}-600 dark:text-${data.color}-400`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{data.description}</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold text-${data.color}-600 dark:text-${data.color}-400`}>
                    {data.count}
                  </div>
                  {data.count === 0 && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real Trees Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tagged Trees</CardTitle>
        </CardHeader>
        <CardContent>
          {userTrees.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No trees tagged yet. Start by scanning your first tree on the map!
            </p>
          ) : (
            <div className="space-y-3">
              {userTrees.map((tree) => (
                <div key={tree.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        tree.category === 'farm' ? 'bg-emerald-500' :
                        tree.category === 'community' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{tree.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tree.scientificName}</p>
                        {tree.localName && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">{tree.localName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={tree.category === 'farm' ? 'default' : tree.category === 'community' ? 'secondary' : 'outline'}
                      className="capitalize"
                    >
                      {tree.category}
                    </Badge>
                    {tree.isVerified && (
                      <Badge variant="default" className="bg-green-500 text-white">
                        ✓
                      </Badge>
                    )}
                    {tree.isAIGenerated && (
                      <Badge variant="outline" className="text-purple-600">
                        🤖
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backend Integration Notice */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
            <Building className="h-5 w-5" />
            <span className="font-semibold">Backend Integration Ready</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
            This dashboard displays real-time data from the TreeContext. 
            Ready for Spring Boot microservices integration with PostgreSQL database on AWS Cloud.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreeLogView;
