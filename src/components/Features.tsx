
import { Check, Zap, Shield, BarChart3 } from "lucide-react";

const featuresList = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Deploy in seconds with our optimized infrastructure and intuitive interface."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with all major security standards."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Gain insights with real-time data visualization and comprehensive reporting."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Features</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale your applications with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {featuresList.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-50 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Everything you need in one place
              </h2>
              <div className="space-y-4">
                {[
                  "Intuitive drag-and-drop interface",
                  "Responsive designs for all devices",
                  "Integrated version control",
                  "Collaborative workspace",
                  "Enterprise-grade security"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 feature-gradient p-8 md:p-12 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-200"></div>
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-200"></div>
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-200"></div>
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
