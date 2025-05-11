
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BusinessInfoFormProps = {
  defaultValues: {
    businessName: string;
    businessType: string;
    targetAudience: string;
    businessGoal: string;
  };
  onSubmit: (data: {
    businessName: string;
    businessType: string;
    targetAudience: string;
    businessGoal: string;
  }) => void;
};

const businessTypes = ["beauty", "food", "coaching", "handmade", "other"];
const businessGoals = ["sales", "visibility", "community", "other"];

const BusinessInfoForm = ({ defaultValues, onSubmit }: BusinessInfoFormProps) => {
  const form = useForm({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </Form>
  );
};

export default BusinessInfoForm;
