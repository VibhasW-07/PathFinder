import { Button } from "@/components/ui/button";
import { BookOpen, Menu, User, X, LogOut } from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { avatarDataUrl } = useProfile();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (clickable to go Home) */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => navigate('/')}
            role="button"
            aria-label="Go to home"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PathFinder</h1>
              <p className="text-xs text-gray-600">Career Guidance Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('features')}
              className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                activeSection === 'features' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                activeSection === 'how-it-works' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                activeSection === 'about' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* CTA / User */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300 hover:shadow-sm"
                    onClick={() => setShowUserMenu((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={showUserMenu}
                  >
                    {avatarDataUrl ? (
                      <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl z-50">
                      <div className="p-3 border-b border-gray-200">
                        <div className="text-xs text-gray-500">Signed in as</div>
                        <div className="text-sm font-medium text-gray-900 break-all">{user?.email}</div>
                      </div>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={() => { setShowUserMenu(false); signOut(); }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <Button 
                  variant="default" 
                  className="bg-black text-white hover:bg-black/90"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleAuthClick} className="text-gray-700 hover:text-blue-600">
                  Sign In
                </Button>
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={handleAuthClick}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slide-in-up">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavClick('features')}
                className={`text-left text-sm font-medium transition-colors ${
                  activeSection === 'features' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => handleNavClick('how-it-works')}
                className={`text-left text-sm font-medium transition-colors ${
                  activeSection === 'how-it-works' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                How It Works
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className={`text-left text-sm font-medium transition-colors ${
                  activeSection === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className={`text-left text-sm font-medium transition-colors ${
                  activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Contact
              </button>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                        {avatarDataUrl ? <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" /> : <User className="h-4 w-4 text-gray-600" />}
                      </div>
                      <span className="text-sm text-gray-600">Signed in</span>
                    </div>
                    <Button 
                      variant="default" 
                      className="bg-black text-white hover:bg-black/90"
                      onClick={() => navigate('/dashboard')}
                    >
                      Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={handleAuthClick} className="text-gray-700 hover:text-blue-600">
                      Sign In
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={handleAuthClick}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;