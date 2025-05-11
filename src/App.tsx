
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Preview from "./pages/Preview";
import MyContent from "./pages/MyContent";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import PostIdea from "./pages/PostIdea";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/onboarding" />} />
            <Route path="/about" element={<><Navigation /><About /></>} />
            
            {/* Protected routes */}
            <Route path="/" element={
              session ? <><Navigation /><Index /></> : <Navigate to="/login" />
            } />
            <Route path="/onboarding" element={
              session ? <Onboarding /> : <Navigate to="/login" />
            } />
            <Route path="/preview" element={
              session ? <><Navigation /><Preview /></> : <Navigate to="/login" />
            } />
            <Route path="/my-content" element={
              session ? <><Navigation /><MyContent /></> : <Navigate to="/login" />
            } />
            <Route path="/pricing" element={
              session ? <><Navigation /><Pricing /></> : <Navigate to="/login" />
            } />
            <Route path="/post-idea" element={
              session ? <><Navigation /><PostIdea /></> : <Navigate to="/login" />
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
