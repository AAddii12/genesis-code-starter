
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Plan {
  name: string;
  price: string;
  credits: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

const Pricing = () => {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const plans: Plan[] = [
    {
      name: "Free",
      price: "₪0",
      credits: "5 credits/month",
      features: [
        "Basic content generation",
        "1 social media platform",
        "Standard quality images",
      ],
      buttonText: currentPlan === "free" ? "Current Plan" : "Use Free Plan",
    },
    {
      name: "Pro",
      price: "₪29/month",
      credits: "50 credits/month",
      features: [
        "Advanced content generation",
        "Multiple social media platforms",
        "High quality images",
        "Content calendar planning",
      ],
      buttonText: currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "VIP",
      price: "₪69/month",
      credits: "Unlimited",
      features: [
        "Premium content generation",
        "All social media platforms",
        "Ultra-high quality images",
        "Content calendar planning",
        "Priority support",
        "Custom branding",
      ],
      buttonText: currentPlan === "vip" ? "Current Plan" : "Upgrade to VIP",
    },
  ];

  const fetchUserPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('user_credits')
          .select('plan_type')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        if (data) {
          setCurrentPlan(data.plan_type);
        }
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  const handleSelectPlan = async (planName: string) => {
    // Don't do anything if this is already the current plan
    if (planName.toLowerCase() === currentPlan) {
      return;
    }
    
    try {
      setLoading(true);

      // In a real implementation, this would redirect to Stripe checkout
      // For demo purposes, we'll just update the user's plan directly
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        let creditsToAllocate = 5; // Free plan
        
        if (planName.toLowerCase() === "pro") {
          creditsToAllocate = 50;
        } else if (planName.toLowerCase() === "vip") {
          creditsToAllocate = 999999; // Essentially unlimited
        }
        
        const { error } = await supabase
          .from('user_credits')
          .update({
            plan_type: planName.toLowerCase(),
            credits_remaining: creditsToAllocate,
            next_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setCurrentPlan(planName.toLowerCase());
        
        toast({
          title: "Plan updated!",
          description: `Your plan has been updated to ${planName}.`,
        });
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Update failed",
        description: "Failed to update your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-gray-600">Select the plan that best fits your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`flex flex-col ${plan.highlighted ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500"> /month</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="font-medium text-sm mb-4">{plan.credits}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={plan.name.toLowerCase() === currentPlan || loading}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
