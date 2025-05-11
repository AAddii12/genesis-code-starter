
import { Link } from "react-router-dom";

const ContentFooter = () => {
  return (
    <footer className="bg-white py-10 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-3">
              <span className="text-xl font-bold text-emerald-500">CONTENT 4 U</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              AI-powered social media content creation for small businesses.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-500 hover:text-emerald-500 text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-500 hover:text-emerald-500 text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-emerald-500 text-sm">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CONTENT 4 U. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContentFooter;
