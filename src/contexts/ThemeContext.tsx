import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved preference in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) return savedTheme;
    
    // Otherwise check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });
  
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Apply theme class to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // If authenticated, save to user profile
    if (user) {
      saveThemePreference(theme);
    }
  }, [theme, user]);
  
  // Get current user and set theme from profile if available
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Try to get their saved preference
        const { data } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', currentUser.id)
          .single();
          
        if (data?.theme) {
          setTheme(data.theme as Theme);
        }
      }
    };
    
    getCurrentUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Try to get their saved preference
          const { data } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', session.user.id)
            .single();
            
          if (data?.theme) {
            setTheme(data.theme as Theme);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const saveThemePreference = async (selectedTheme: Theme) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        theme: selectedTheme,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
