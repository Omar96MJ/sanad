
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, Helping Hand, ShieldAlert } from 'lucide-react';
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
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isRTL = language === 'ar';

  const navLinks = [
    { href: "/", label: t('Home') },
    { href: "/blog", label: t('Blog') },
    { href: "/psychological-tests", label: t('Psychological Tests') },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container-custom h-16 md:h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold slide-in-right"
        >
          <Helping Hand className="text-primary h-6 w-6" />
          <span>سند</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              to={link.href} 
              className={`transition-custom px-2 ${isActive(link.href) ? 'text-primary font-medium' : 'hover:text-primary'}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          
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
              <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
                <DropdownMenuLabel>{t('my_account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin-dashboard">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      {t('admin_panel')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}>
                    {t('dashboard')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t('profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">{t('login')}</Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary">{t('signup')}</Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button 
            className="text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t">
          <div className="container-custom py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`py-2 ${isActive(link.href) ? 'text-primary font-medium' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin() && (
                  <Link to="/admin-dashboard" className="py-2 flex items-center">
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    {t('admin_panel')}
                  </Link>
                )}
                <Link 
                  to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} 
                  className="py-2"
                >
                  {t('dashboard')}
                </Link>
                <Link to="/profile" className="py-2">{t('profile')}</Link>
                <button 
                  onClick={logout} 
                  className="py-2 text-left text-destructive"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button variant="ghost" className="w-full justify-start">{t('login')}</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary w-full">{t('signup')}</Button>
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
