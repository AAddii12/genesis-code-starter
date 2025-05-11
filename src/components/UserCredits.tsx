
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

type UserCreditsProps = {
  hideDetails?: boolean;
};

const UserCredits = ({ hideDetails = false }: UserCreditsProps) => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [planType, setPlanType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_credits")
          .select("credits_remaining, plan_type")
          .eq("user_id", user.id)
          .single();
          
        if (error) throw error;
        setCredits(data.credits_remaining);
        setPlanType(data.plan_type);
      } catch (error) {
        console.error("Error fetching user credits:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCredits();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || loading) return null;

  if (hideDetails) {
    return (
      <div className="flex items-center text-sm font-medium">
        <CreditCard className="mr-1 h-4 w-4" />
        <span>{credits}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <CreditCard className="h-4 w-4" />
      <span className="font-medium">{credits} credits</span>
      <span className="text-muted-foreground">
        ({planType?.charAt(0).toUpperCase() + planType?.slice(1)} plan)
      </span>
    </div>
  );
};

export default UserCredits;
