
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Initialize Supabase client with Admin Key (to bypass RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 1. Get all active users with profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('business_name, user_id')
    
    if (profilesError) throw profilesError
    
    // In a real implementation, you would:
    // 1. Get user emails from auth.users (requires service role)
    // 2. Send emails using a service like SendGrid, AWS SES, etc.
    
    const emailsSent = profiles.length
    
    // Log instead of sending actual emails in this example
    console.log(`Would send ${emailsSent} emails to users`)
    
    return new Response(
      JSON.stringify({ success: true, emailsSent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
