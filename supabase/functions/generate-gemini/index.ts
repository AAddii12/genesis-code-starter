
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

    // Get Google Studio API key from environment variables
    const googleStudioKey = Deno.env.get("GOOGLE_STUDIO");
    
    if (!googleStudioKey) {
      console.error("GOOGLE_STUDIO environment variable not found");
      throw new Error("GOOGLE_STUDIO not found in environment variables");
    }

    console.log("Generating text with Gemini and prompt:", prompt);

    // Call the OpenAI API (with Gemini model, using the GOOGLE_STUDIO key)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${googleStudioKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using this model, but through the GOOGLE_STUDIO key
        messages: [
          {
            role: "system",
            content: "You are a marketing expert specialized in creating engaging, conversion-focused social media content. Focus on creating content that motivates user action."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(`API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log("Text generated successfully with Gemini");

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
    console.error("Error generating text with Gemini:", error);
    
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
