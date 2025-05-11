
import { Button } from "@/components/ui/button";
import { ArrowRight, Image, MessageSquare, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/ContentFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col font-rubik">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F2FCE2] to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 animate-fade-in">
              Effortless Content Creation for Your Business
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]">
              Generate stunning posts, stories and captions in one click – tailored to your brand.
            </p>
            <div className="mt-10 animate-fade-in [animation-delay:0.4s]">
              <Button 
                size="lg" 
                className="text-base px-8 py-6 bg-emerald-500 hover:bg-emerald-600 rounded-full"
                asChild
              >
                <Link to="/onboarding">
                  Let's Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 w-full max-w-4xl mx-auto relative animate-slide-up [animation-delay:0.6s]">
              <div className="aspect-video bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 text-emerald-500">
                        <Image className="w-full h-full" />
                      </div>
                      <p className="text-gray-500">Your AI-Generated Visual</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <div className="h-8 w-8 rounded-full bg-emerald-100"></div>
                      <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-50 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDE1D3] rounded-full flex items-center justify-center text-orange-500 mb-4">
                <Image className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tailored to Your Brand</h3>
              <p className="text-gray-600">Customized by your business type & style to match your unique brand identity.</p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-50 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#D3E4FD] rounded-full flex items-center justify-center text-blue-500 mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Generated Magic</h3>
              <p className="text-gray-600">Visuals + captions ready instantly with our powerful AI technology.</p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-50 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F2FCE2] rounded-full flex items-center justify-center text-green-500 mb-4">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Save & Share Easily</h3>
              <p className="text-gray-600">Export to Instagram, WhatsApp, or download for immediate use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F1F0FB]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Ready to power up your social media?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of businesses already saving time and resources with CONTENT 4 U.
          </p>
          <Button 
            size="lg" 
            className="text-base px-8 py-6 bg-emerald-500 hover:bg-emerald-600 rounded-full"
            asChild
          >
            <Link to="/onboarding">
              Let's Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
