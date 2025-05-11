
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="p-8 shadow-md border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 rounded-full bg-[#e5d8ff] dark:bg-[#32294d] flex items-center justify-center mb-4">
          <Trash className="h-10 w-10 text-[#7e69ab] dark:text-[#c9b4e8]" />
        </div>
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No content yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
          You haven't saved any content yet. Generate and save some amazing content to see it here.
        </p>
        <Button 
          onClick={() => window.location.href = "/preview"} 
          className="bg-[#9b87f5] hover:bg-[#7e69ab] dark:bg-[#7e69ab] dark:hover:bg-[#6e59a5] text-white font-medium px-6 py-2 rounded-xl transition-all hover:translate-y-[-2px]"
        >
          Create Content
        </Button>
      </CardContent>
    </Card>
  );
};
