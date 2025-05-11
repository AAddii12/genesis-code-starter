
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { toast } from "sonner";

const UserNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(`Error logging out: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavItems = () => (
    <>
      <Link to="/" className="text-foreground hover:text-primary">
        Home
      </Link>
      {user ? (
        <>
          <Link to="/onboarding" className="text-foreground hover:text-primary">
            Create Content
          </Link>
          <Link to="/my-content" className="text-foreground hover:text-primary">
            My Content
          </Link>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </>
      ) : (
        <Link to="/auth">
          <Button>Login / Sign Up</Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="w-full py-4 px-4 border-b">
      <div className="container flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          CONTENT 4 U
        </Link>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-6 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItems />
        </div>
      </div>
    </header>
  );
};

export default UserNavigation;
