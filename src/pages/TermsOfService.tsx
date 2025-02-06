import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
            <p>Welcome to Save ("we," "our," or "us"). By accessing or using our platform, you agree to these Terms of Service.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">2. Service Description</h2>
            <p>Save is an AI-powered platform designed to assist healthcare professionals in risk management and documentation. The platform provides suggestions and guidance based on input cases but does not replace professional medical judgment.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">3. Disclaimer of Medical Advice</h2>
            <p>The platform does not provide medical advice. All suggestions and guidance are for informational purposes only. Healthcare professionals must rely on their own professional judgment for all medical decisions and patient care.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">4. No Liability</h2>
            <p>We expressly disclaim all liability for any damages, claims, or injuries arising from:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use or reliance on our platform's suggestions</li>
              <li>Medical decisions made with or without our platform's assistance</li>
              <li>Errors, inaccuracies, or omissions in AI-generated content</li>
              <li>Technical issues or service interruptions</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">5. AI Technology</h2>
            <p>Our platform utilizes OpenAI's technology. AI responses may be incorrect, incomplete, or inappropriate for specific situations. Users must verify all information independently.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">6. Data Usage</h2>
            <p>We collect and store user data solely for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing and improving our services</li>
              <li>Analytics and performance monitoring</li>
              <li>User support and communication</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">7. Third-Party Services</h2>
            <p>We use various third-party services including Google Analytics and OpenAI. We are not affiliated with or endorsed by any medical organizations or compliance bodies mentioned on our website.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">8. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;