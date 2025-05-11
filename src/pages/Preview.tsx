
import { useUserProfile } from "@/hooks/useUserProfile";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { ContentPreviewCard } from "@/components/preview/ContentPreviewCard";
import { UserProfileSummary } from "@/components/preview/UserProfileSummary";
import { BackgroundDecorations } from "@/components/preview/BackgroundDecorations";

const Preview = () => {
  const { userProfile } = useUserProfile();
  const {
    generatedImage,
    caption,
    setCaption,
    userCredits,
    isGenerating,
    isLoading,
    generateContent,
    saveToMyContent,
    downloadContent
  } = useContentGeneration(userProfile);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efe1f8] dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#efe1f8] dark:bg-gray-900 font-rubik relative rounded-none">
      <BackgroundDecorations />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Content Preview</h1>
        
        <ContentPreviewCard
          generatedImage={generatedImage}
          caption={caption}
          setCaption={setCaption}
          userCredits={userCredits}
          isGenerating={isGenerating}
          isLoading={isLoading}
          generateContent={generateContent}
          downloadContent={downloadContent}
          saveToMyContent={saveToMyContent}
        />

        <UserProfileSummary userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Preview;
