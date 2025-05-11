
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types";

interface UserProfileSummaryProps {
  userProfile: UserProfile;
}

export const UserProfileSummary = ({ userProfile }: UserProfileSummaryProps) => {
  return (
    <Card className="rounded-xl shadow-lg hover:shadow-xl transition-all border-[#e5d8ff]">
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Your Business Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Business Name</p>
            <p className="text-gray-700">{userProfile.businessName}</p>
          </div>
          
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Business Type</p>
            <p className="text-gray-700">{userProfile.businessType}</p>
          </div>
          
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Target Audience</p>
            <p className="text-gray-700">{userProfile.targetAudience}</p>
          </div>
          
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Business Goal</p>
            <p className="text-gray-700">{userProfile.businessGoal}</p>
          </div>
          
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Color Palette</p>
            <p className="text-gray-700">{userProfile.colorPalette}</p>
          </div>
          
          <div className="p-3 bg-[#f9f5ff] rounded-lg">
            <p className="text-sm font-medium text-[#7e69ab] mb-1">Style Vibe</p>
            <p className="text-gray-700">{userProfile.styleVibe}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
