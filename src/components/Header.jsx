import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useToast } from './ui/toast';
import { LogOut, Menu, BookOpen, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      // Clear auth token (adjust based on your auth system)
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: LogOut },
    { name: 'My Bookings', path: '/my-bookings', icon: Menu },
    { name: 'My Fitness Plans', path: '/my-fitness-plans', icon: X },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 tracking-tighter">
              <span className="text-blue-600">Pulse</span>
              <span className="text-orange-600">Fit</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 text-base font-medium ${
                  isActive(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                aria-label={`Navigate to ${item.name}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
              
              
            ))}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-base font-medium text-red-600 border-red-600 hover:bg-red-50"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 animate-fade-in">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-base font-medium w-full justify-start ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={`Navigate to ${item.name}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            ))}
            <Button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="flex items-center gap-2 text-base font-medium text-red-600 border-red-600 hover:bg-red-50 w-full justify-start"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;