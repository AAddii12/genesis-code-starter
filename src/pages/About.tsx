
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">About CONTENT 4 U</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is CONTENT 4 U?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              CONTENT 4 U is an AI-powered content generator for small business owners, 
              entrepreneurs, and social media managers who need to create engaging social media content quickly and efficiently.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">🧩 1. Smart Onboarding Form</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A multi-step onboarding form that asks the user for business info and visual preferences,
                  storing the answers in a user profile.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 2. AI Visual Generator</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Uses FAL API to generate custom social media post images based on the user's business profile.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 3. Marketing Text Generator</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Uses OpenAI's GPT API to generate marketing captions tailored to the user's business type and goals.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 4. Content Preview & Editor</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Shows generated images and text with the ability to edit, download, and save content.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 5. My Content (Saved Posts)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Displays a gallery of the user's saved posts with options to download, share, and delete.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 6. Monthly Reminder Automation</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Scheduled automation that sends monthly email reminders to users about generating new content.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 7. Credit-Based Usage System</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Users get monthly credits, with each content generation costing 1 credit. Options to upgrade for more credits.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">🧩 8. Payment Plans</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Free Plan (5 credits/month), Pro Plan (₪29/month - 50 credits), 
                  and VIP Plan (₪69/month - Unlimited usage).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Who It's For</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">CONTENT 4 U is designed for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Small business owners managing their own social media</li>
              <li>Entrepreneurs launching new products or services</li>
              <li>Social media managers handling multiple accounts</li>
              <li>Content creators looking to streamline their workflow</li>
              <li>Anyone who struggles with creating consistent, engaging social media content</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
