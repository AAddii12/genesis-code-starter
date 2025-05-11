
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Join thousands of teams already using our platform to build amazing digital experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-primary font-medium px-8">
            Start for Free
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-medium px-8">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
