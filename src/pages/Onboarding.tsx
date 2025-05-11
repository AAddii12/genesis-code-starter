
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type UserProfile = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  businessGoal: string;
  colorPalette: string;
  styleVibe: string;
  preferredPlatforms: string[];
};

const businessTypes = ["beauty", "food", "coaching", "handmade", "other"];
const businessGoals = ["sales", "visibility", "community", "other"];
const colorPalettes = ["soft pastels", "neon bold", "monochrome", "custom"];
const styleVibes = ["minimalist", "playful", "elegant", "high-tech"];
const platforms = ["Instagram", "Facebook", "WhatsApp", "TikTok"];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    businessName: "",
    businessType: "",
    targetAudience: "",
    businessGoal: "",
    colorPalette: "",
    styleVibe: "",
    preferredPlatforms: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<UserProfile>({
    defaultValues: userProfile,
  });

  const handleNextStep = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast.error("You must be logged in to complete the onboarding");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    const finalProfile = { ...userProfile, ...data };
    
    try {
      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        business_name: finalProfile.businessName,
        business_type: finalProfile.businessType,
        target_audience: finalProfile.targetAudience,
        business_goal: finalProfile.businessGoal,
        color_palette: finalProfile.colorPalette,
        style_vibe: finalProfile.styleVibe,
        preferred_platforms: finalProfile.preferredPlatforms,
      });

      if (error) throw error;

      toast.success("Profile created successfully!");
      navigate("/preview", { state: { userProfile: finalProfile } });
    } catch (error: any) {
      toast.error(`Failed to save profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {step === 1 ? "Business Information" : "Visual Preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {step === 1 ? (
              <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="Who is your target audience?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessGoals.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal.charAt(0).toUpperCase() + goal.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full mt-6">Next Step</Button>
              </form>
            ) : (
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="colorPalette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Palette</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color palette" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorPalettes.map((palette) => (
                            <SelectItem key={palette} value={palette}>
                              {palette.charAt(0).toUpperCase() + palette.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="styleVibe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Vibe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style vibe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {styleVibes.map((vibe) => (
                            <SelectItem key={vibe} value={vibe}>
                              {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferredPlatforms"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Preferred Platforms</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {platforms.map((platform) => (
                          <FormField
                            key={platform}
                            control={form.control}
                            name="preferredPlatforms"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={platform}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(platform)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], platform])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== platform
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {platform}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/2" 
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-1/2" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Profile..." : "Let's Start"}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
