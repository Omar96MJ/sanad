
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-custom h-16 md:h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold slide-in-right"
        >
          <Heart className="text-primary h-6 w-6" />
          <span>MindfulCare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`transition-custom px-2 ${isActive('/') ? 'text-primary font-medium' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/blog" 
            className={`transition-custom px-2 ${isActive('/blog') ? 'text-primary font-medium' : 'hover:text-primary'}`}
          >
            Blog
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-muted">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t">
          <div className="container-custom py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className={`py-2 ${isActive('/') ? 'text-primary font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className={`py-2 ${isActive('/blog') ? 'text-primary font-medium' : ''}`}
            >
              Blog
            </Link>
            {user ? (
              <>
                <Link 
                  to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} 
                  className="py-2"
                >
                  Dashboard
                </Link>
                <Link to="/profile" className="py-2">Profile</Link>
                <button 
                  onClick={logout} 
                  className="py-2 text-left text-destructive"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
