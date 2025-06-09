
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTree } from '@/contexts/TreeContext';
import { Badge } from '@/components/ui/badge';

const TreeLogView = () => {
  const { userTrees } = useTree();

  const categoryStats = {
    farm: userTrees.filter(tree => tree.category === 'farm').length,
    community: userTrees.filter(tree => tree.category === 'community').length,
    nursery: userTrees.filter(tree => tree.category === 'nursery').length,
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-800">Tree Log Dashboard</h1>
        <p className="text-muted-foreground">Your tree tagging statistics and history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userTrees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Farm Forestry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{categoryStats.farm}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Community</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{categoryStats.community}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nursery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{categoryStats.nursery}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trees */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trees</CardTitle>
        </CardHeader>
        <CardContent>
          {userTrees.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No trees tagged yet. Start by scanning your first tree!
            </p>
          ) : (
            <div className="space-y-3">
              {userTrees.slice(0, 5).map((tree) => (
                <div key={tree.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{tree.name}</h3>
                    <p className="text-sm text-muted-foreground">{tree.scientificName}</p>
                  </div>
                  <Badge variant={tree.category === 'farm' ? 'default' : tree.category === 'community' ? 'secondary' : 'outline'}>
                    {tree.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Analytics charts and advanced features will be implemented in Phase 3
      </div>
    </div>
  );
};

export default TreeLogView;
