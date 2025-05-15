
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Preview from "./pages/Preview";
import MyContent from "./pages/MyContent";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Navigation from "./components/Navigation";
import PostIdea from "./pages/PostIdea";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { ToastProvider } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render anything while checking auth state
  if (isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* All routes are now accessible without authentication */}
              <Route path="/" element={<><Navigation /><Index /></>} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/preview" element={<><Navigation /><Preview /></>} />
              <Route path="/my-content" element={<><Navigation /><MyContent /></>} />
              <Route path="/pricing" element={<><Navigation /><Pricing /></>} />
              <Route path="/about" element={<><Navigation /><About /></>} />
              <Route path="/post-idea" element={<><Navigation /><PostIdea /></>} />
              <Route path="/login" element={<><Navigation /><Index /></>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
