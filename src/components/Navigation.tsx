
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
          <span className="font-semibold text-lg">ModernApp</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-sm font-medium">Log In</Button>
          <Button className="text-sm font-medium">Get Started</Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-x-0 top-[72px] bg-white z-40 transition-all duration-300 md:hidden",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="container mx-auto px-4 py-6 flex flex-col space-y-6 shadow-lg">
          <a href="#features" className="text-base font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-base font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>How it works</a>
          <a href="#testimonials" className="text-base font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
          <a href="#pricing" className="text-base font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <div className="flex flex-col space-y-3 pt-4 border-t">
            <Button variant="outline" className="w-full">Log In</Button>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
