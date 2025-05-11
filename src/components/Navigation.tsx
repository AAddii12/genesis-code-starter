
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          await fetchUserCredits(session.user.id);
        } else {
          setUser(null);
          setCredits(null);
        }
      }
    );

    // Check current auth state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchUserCredits(user.id);
      }
    };
    
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      if (data) {
        setCredits(data.credits_remaining);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-gray-900 dark:text-white">CONTENT 4 U</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium ${
                location.pathname === "/" 
                  ? "text-primary dark:text-primary-foreground" 
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/onboarding" 
                  className={`text-sm font-medium ${
                    location.pathname === "/onboarding" 
                      ? "text-primary dark:text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Create Content
                </Link>
                
                <Link 
                  to="/my-content" 
                  className={`text-sm font-medium ${
                    location.pathname === "/my-content" 
                      ? "text-primary dark:text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  My Content
                </Link>

                <Link 
                  to="/pricing" 
                  className={`text-sm font-medium ${
                    location.pathname === "/pricing" 
                      ? "text-primary dark:text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  Plans
                </Link>
                
                <Link 
                  to="/about" 
                  className={`text-sm font-medium ${
                    location.pathname === "/about" 
                      ? "text-primary dark:text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  About
                </Link>

                {credits !== null && (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1">
                    {credits} credits
                  </span>
                )}
                
                <ThemeToggle />
                
                <Button variant="outline" onClick={handleSignOut} className="border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className={`text-sm font-medium ${
                    location.pathname === "/about" 
                      ? "text-primary dark:text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  About
                </Link>
                
                <ThemeToggle />
                
                <Button onClick={handleSignIn}>
                  Sign In
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                location.pathname === "/" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/onboarding" 
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    location.pathname === "/onboarding" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Content
                </Link>
                
                <Link 
                  to="/my-content" 
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    location.pathname === "/my-content" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Content
                </Link>
                
                <Link 
                  to="/pricing" 
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    location.pathname === "/pricing" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Plans
                </Link>
                
                <Link 
                  to="/about" 
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    location.pathname === "/about" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                
                {credits !== null && (
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1">
                      {credits} credits
                    </span>
                  </div>
                )}
                
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    location.pathname === "/about" 
                      ? "bg-primary text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignIn();
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
