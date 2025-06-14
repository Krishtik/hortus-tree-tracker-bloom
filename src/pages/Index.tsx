
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import LandingPage from '@/components/layout/LandingPage';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <AuthenticatedLayout />;
};

export default Index;
