import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast({ title: "Signed in!", description: "Welcome back.", variant: "success" });
      } else {
        await signup(email, password, name);
        toast({ title: "Account created!", description: "Welcome to Krish Hortus.", variant: "success" });
      }
      onClose();
      resetForm();
      // Optionally navigate to dashboard or home if you want:
      // navigate('/');
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl">
        <DialogHeader className="p-8 pb-4 text-center bg-gradient-to-r from-green-600/5 to-emerald-600/5">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Leaf className="h-12 w-12 text-green-600" />
              <Sparkles className="h-6 w-6 text-emerald-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join the Forest Revolution'}
          </DialogTitle>
        </DialogHeader>
        <div className="p-8 pt-4">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="pb-6 text-center">
              <CardDescription className="text-lg text-muted-foreground">
                {isLogin 
                  ? 'Sign in to access your botanical journey' 
                  : 'Create an account and start mapping the green world'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-700 font-medium">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-5 w-5 text-green-600 group-focus-within:text-green-700 transition-colors" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-12 border-2 border-green-200 focus:border-green-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-700 font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-green-600 group-focus-within:text-green-700 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-2 border-green-200 focus:border-green-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-700 font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-green-600 group-focus-within:text-green-700 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-2 border-green-200 focus:border-green-400 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 h-5 w-5 text-green-600 hover:text-green-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                    : (isLogin ? 'Sign In' : 'Create Account')
                  }
                </Button>
              </form>
              <div className="text-center pt-6 border-t border-green-200/50">
                <p className="text-sm text-muted-foreground mb-3">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={toggleAuthMode}
                  className="text-green-600 hover:text-green-700 font-semibold text-base transition-colors duration-200"
                >
                  {isLogin ? 'Create new account' : 'Sign in instead'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;