
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Header with content for all users
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-gray-900">CONTENT 4 U</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium ${
                location.pathname === "/" 
                  ? "text-primary" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/onboarding" 
              className={`text-sm font-medium ${
                location.pathname === "/onboarding" 
                  ? "text-primary" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create Content
            </Link>
            
            <Link 
              to="/my-content" 
              className={`text-sm font-medium ${
                location.pathname === "/my-content" 
                  ? "text-primary" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              My Content
            </Link>

            <Link 
              to="/pricing" 
              className={`text-sm font-medium ${
                location.pathname === "/pricing" 
                  ? "text-primary" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Plans
            </Link>
            
            <Link 
              to="/about" 
              className={`text-sm font-medium ${
                location.pathname === "/about" 
                  ? "text-primary" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              About
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="md:hidden bg-white border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                location.pathname === "/" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link 
              to="/onboarding" 
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                location.pathname === "/onboarding" 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
