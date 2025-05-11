
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type VisualPreferencesFormProps = {
  defaultValues: {
    colorPalette: string;
    styleVibe: string;
    preferredPlatforms: string[];
  };
  onSubmit: (data: {
    colorPalette: string;
    styleVibe: string;
    preferredPlatforms: string[];
  }) => void;
  onBack: () => void;
  isSubmitting: boolean;
};

const colorPalettes = ["soft pastels", "neon bold", "monochrome", "custom"];
const styleVibes = ["minimalist", "playful", "elegant", "high-tech"];
const platforms = ["Instagram", "Facebook", "WhatsApp", "TikTok"];

const VisualPreferencesForm = ({ defaultValues, onSubmit, onBack, isSubmitting }: VisualPreferencesFormProps) => {
  const form = useForm({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit" className="w-1/2" disabled={isSubmitting}>
            {isSubmitting ? "Creating Profile..." : "Let's Start"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VisualPreferencesForm;
