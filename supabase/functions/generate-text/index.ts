
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY environment variable not found");
      
      // Instead of throwing, return a fallback text with a 200 status
      return new Response(
        JSON.stringify({ 
          text: generateFallbackText(prompt),
          isFallback: true,
          error: "OPENAI_API_KEY not found in environment variables" 
        }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    console.log("Generating text with prompt:", prompt);

    try {
      // Call OpenAI API with the OpenAI key
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a marketing expert specialized in writing engaging social media captions. Create concise, impactful content with appropriate hashtags and a clear call to action."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error response:", errorData);
        
        // Return fallback text with a 200 status instead of error
        return new Response(
          JSON.stringify({ 
            text: generateFallbackText(prompt),
            isFallback: true,
            error: `OpenAI API error: ${response.status}` 
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
      }
      
      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      console.log("Text generated successfully");

      return new Response(
        JSON.stringify({ text: generatedText }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError);
      
      // Return fallback text with a 200 status
      return new Response(
        JSON.stringify({ 
          text: generateFallbackText(prompt),
          isFallback: true,
          error: apiError.message 
        }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return a generic fallback with a 200 status
    return new Response(
      JSON.stringify({ 
        text: "Experience our latest products designed with you in mind! Perfect for everyday use, our high-quality items are trending now. Click the link in bio to shop. #TrendAlert #MustHave #ShopNow",
        isFallback: true,
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

// Generate fallback text based on the user's input
function generateFallbackText(prompt: string): string {
  // Extract business type and target audience if present in the prompt
  let businessType = "business";
  let audience = "customers";
  let style = "professional";
  
  if (prompt) {
    const businessMatch = prompt.match(/(?:for a|for an)\s+([a-zA-Z\s]+)(?:\s+targeting|\s+business)/i);
    if (businessMatch && businessMatch[1]) {
      businessType = businessMatch[1].trim();
    }
    
    const audienceMatch = prompt.match(/targeting\s+([a-zA-Z\s]+)(?:\s+in|\s+with|\.|$)/i);
    if (audienceMatch && audienceMatch[1]) {
      audience = audienceMatch[1].trim();
    }
    
    const styleMatch = prompt.match(/(?:in a|with a)\s+([a-zA-Z\s]+)(?:\s+tone|\s+style)/i);
    if (styleMatch && styleMatch[1]) {
      style = styleMatch[1].trim();
    }
  }
  
  // Create a structured fallback message
  return `✨ Introducing our latest ${businessType} collection designed specifically for ${audience}! 
Our ${style} approach ensures you'll stand out. Check out our website and follow us for more updates. 
#${businessType.replace(/\s+/g, '')} #Trending #Quality`;
}
