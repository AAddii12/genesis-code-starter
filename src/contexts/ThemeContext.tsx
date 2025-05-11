
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [user, setUser] = useState<any>(null);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Check for user and load their theme preference
  useEffect(() => {
    const loadUserTheme = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Try to get their saved preference using raw query to avoid type errors
        const { data, error } = await supabase.rpc('get_user_theme', { 
          userid: currentUser.id 
        }) as { data: string | null, error: any };
          
        if (!error && data) {
          setTheme(data as Theme);
        }
      }
    };
    
    loadUserTheme();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        if (session.user) {
          setUser(session.user);
          
          // Try to get their saved preference using raw query to avoid type errors
          const { data, error } = await supabase.rpc('get_user_theme', { 
            userid: session.user.id 
          }) as { data: string | null, error: any };
            
          if (!error && data) {
            setTheme(data as Theme);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Reset to system theme or load from localStorage on sign out
          const savedTheme = localStorage.getItem("theme") as Theme;
          setTheme(savedTheme || "system");
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save theme preference when it changes
  const saveThemePreference = async (selectedTheme: Theme) => {
    if (!user) return;
    
    // Use custom RPC function to avoid type errors with new tables
    const { error } = await supabase.rpc('set_user_theme', { 
      userid: user.id,
      user_theme: selectedTheme
    }) as { error: any };
      
    if (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Update theme and save preference
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (user) {
      saveThemePreference(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
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
