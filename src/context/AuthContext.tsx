
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserCredits = {
  credits_remaining: number;
  plan_type: string;
  next_reset_date: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userCredits: UserCredits | null;
  fetchUserCredits: () => Promise<void>;
  consumeCredit: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  userCredits: null,
  fetchUserCredits: async () => {},
  consumeCredit: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user credits whenever the user changes
  useEffect(() => {
    if (user) {
      fetchUserCredits();
    } else {
      setUserCredits(null);
    }
  }, [user]);

  const fetchUserCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining, plan_type, next_reset_date")
        .eq("user_id", user.id)
        .single();
        
      if (error) throw error;
      setUserCredits(data);
    } catch (error: any) {
      console.error("Error fetching user credits:", error);
    }
  };

  const consumeCredit = async (): Promise<boolean> => {
    if (!user || !userCredits) return false;
    
    if (userCredits.plan_type === 'unlimited') {
      return true;
    }
    
    if (userCredits.credits_remaining <= 0) {
      toast.error("You've used all your credits. Upgrade to continue.");
      return false;
    }
    
    try {
      const newCredits = userCredits.credits_remaining - 1;
      
      const { error } = await supabase
        .from("user_credits")
        .update({ credits_remaining: newCredits })
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setUserCredits({
        ...userCredits,
        credits_remaining: newCredits
      });
      
      return true;
    } catch (error: any) {
      console.error("Error consuming credit:", error);
      toast.error("Failed to update credits. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading,
      userCredits,
      fetchUserCredits,
      consumeCredit
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
