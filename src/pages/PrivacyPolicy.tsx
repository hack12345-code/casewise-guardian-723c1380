import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Information Collection</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (name, email, professional credentials)</li>
              <li>Case information and medical scenarios you input</li>
              <li>Usage data and interaction with our platform</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">2. Use of Information</h2>
            <p>We use collected information for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing and improving our services</li>
              <li>Analyzing usage patterns and platform performance</li>
              <li>Communicating with users about our services</li>
              <li>Ensuring compliance with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Storage and Security</h2>
            <p>We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">4. Third-Party Services</h2>
            <p>We use third-party services including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>OpenAI for AI-powered responses</li>
              <li>Google Analytics for usage analysis</li>
              <li>Cloud service providers for data storage</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Retention</h2>
            <p>We retain your information for as long as necessary to provide our services and comply with legal obligations.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain data collection</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">7. Updates to Privacy Policy</h2>
            <p>We may update this privacy policy periodically. Continued use of our services constitutes acceptance of any changes.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-4">8. Contact Us</h2>
            <p>For questions about this privacy policy, please contact us at privacy@save.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;