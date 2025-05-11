
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
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY environment variable not found");
      throw new Error("OPENAI_API_KEY not found in environment variables");
    }

    console.log("Generating text with prompt:", prompt);

    // Call OpenAI API to generate text
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
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
      throw new Error(`OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`);
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
  } catch (error) {
    console.error("Error generating text:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
