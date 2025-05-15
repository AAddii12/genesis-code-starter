
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
import { toast } from "@/hooks/use-toast";

export const useUserCredits = (userProfile: UserProfile | null) => {
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    if (userProfile) {
      loadUserCredits();
    }
  }, [userProfile]);

  const loadUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setUserCredits(data.credits_remaining);
      } else {
        // If no record exists, they may be on the free tier with default credits
        setUserCredits(5);
      }
    } catch (error) {
      console.error("Error loading user credits:", error);
      toast({
        title: "Failed to load credits",
        description: "Could not retrieve your available credits",
        variant: "destructive",
      });
    }
  };

  const deductCredit = async () => {
    if (userCredits === null) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Deduct one credit
      const newCreditCount = userCredits - 1;
      
      const { error } = await supabase
        .from("user_credits")
        .update({ credits_remaining: newCreditCount })
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setUserCredits(newCreditCount);
    } catch (error) {
      console.error("Error deducting credit:", error);
      toast({
        title: "Credit error",
        description: "Failed to update your credits",
        variant: "destructive",
      });
    }
  };

  return {
    userCredits,
    deductCredit
  };
};
