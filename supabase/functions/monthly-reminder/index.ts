
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req: Request) => {
  try {
    console.log("Monthly reminder cron job started");

    // Fetch all users with their profiles
    const { data: users, error: userError } = await supabase
      .from("user_profiles")
      .select("business_name, user_id");

    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log(`Found ${users.length} users to send reminders to`);

    // Get user emails from auth.users
    for (const profile of users) {
      try {
        const { data: userData, error: authError } = await supabase
          .auth
          .admin
          .getUserById(profile.user_id);

        if (authError || !userData) {
          console.error(`Error fetching user ${profile.user_id}: ${authError?.message || "User not found"}`);
          continue;
        }

        const email = userData.user.email;
        const businessName = profile.business_name || "your business";

        if (!email) {
          console.error(`No email found for user ${profile.user_id}`);
          continue;
        }

        // Send email reminder
        const { error: sendError } = await resend.emails.send({
          from: "CONTENT 4 U <onboarding@resend.dev>",
          to: [email],
          subject: "New Templates Available - Create Fresh Content!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi there,</h2>
              <p>New trending templates are ready for you on CONTENT 4 U. It's time to generate fresh content for ${businessName}!</p>
              <p>Your audience is waiting for your next post. Keep your social media engaging with our AI-powered content tools.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://content4u.app/" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Create New Content Now</a>
              </div>
              <p>Best regards,<br>The CONTENT 4 U Team</p>
            </div>
          `,
        });

        if (sendError) {
          console.error(`Error sending email to ${email}: ${sendError}`);
        } else {
          console.log(`Monthly reminder sent to ${email}`);
        }
      } catch (error) {
        console.error(`Error processing user ${profile.user_id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Monthly reminders sent successfully",
        usersProcessed: users.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in monthly reminder job: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
