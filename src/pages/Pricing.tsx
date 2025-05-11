
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const PricingPage = () => {
  const { user, userCredits } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planType: string) => {
    if (!user) {
      toast.info("Please sign in to upgrade your plan");
      navigate("/auth");
      return;
    }

    // In a real app, this would redirect to a Stripe checkout page
    toast.info(`This would redirect to payment page for the ${planType} plan`);
  };

  const plans = [
    {
      name: "Free Plan",
      price: "₪0",
      period: "per month",
      description: "Basic content creation for small businesses",
      features: ["5 credits per month", "Standard templates", "Email support"],
      buttonText: "Current Plan",
      type: "free",
      disabled: userCredits?.plan_type === "free",
    },
    {
      name: "Pro Plan",
      price: "₪29",
      period: "per month",
      description: "Enhanced tools for growing businesses",
      features: ["50 credits per month", "Premium templates", "Priority support", "Advanced analytics"],
      buttonText: "Upgrade to Pro",
      type: "pro",
      disabled: userCredits?.plan_type === "pro",
    },
    {
      name: "VIP Plan",
      price: "₪69",
      period: "per month",
      description: "Unlimited tools for power users",
      features: ["Unlimited content generation", "Custom branding", "Dedicated account manager", "API access"],
      buttonText: "Upgrade to VIP",
      type: "unlimited",
      disabled: userCredits?.plan_type === "unlimited",
    }
  ];

  return (
    <div className="container py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for your business. All plans include access to our core content generation features.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.type === "pro" ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
              <CardDescription className="mt-3">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.disabled ? "outline" : "default"}
                onClick={() => handlePlanSelect(plan.type)}
                disabled={plan.disabled}
              >
                {plan.disabled ? "Current Plan" : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
