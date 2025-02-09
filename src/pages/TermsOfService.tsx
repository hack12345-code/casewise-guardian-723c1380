
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
            <p>Welcome to Saver ("Company," "we," "our," "us"). These Terms of Service ("Terms") govern your access to and use of our platform, website, and services (collectively, the "Services"). By using our Services, you agree to abide by these Terms. If you do not agree, do not use our Services.</p>
            <p>Saver is designed to assist healthcare professionals in mitigating the risk of malpractice by providing AI-generated guidance based on legal and clinical best practices. Additionally, our platform assists with case report writing. However, all decisions and actions remain the responsibility of the user.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">2. Eligibility</h2>
            <p>By using our Services, you confirm that you are a licensed healthcare professional or an authorized medical worker. You agree to use the Services in compliance with all applicable laws and regulations.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">3. No Legal or Medical Liability</h2>
            <p>Saver does not provide medical, legal, or professional advice. The AI-generated content is for informational purposes only and should not be considered a substitute for professional judgment.</p>
            <p>You are solely responsible for evaluating the appropriateness and accuracy of the information provided.</p>
            <p>Saver assumes no liability for any consequences resulting from the use of our AI-generated recommendations.</p>
            <p>You must exercise your own medical and legal judgment in each case and follow professional standards and institutional guidelines.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">4. No Client or Patient Data Requirement</h2>
            <p>Users must not enter personally identifiable patient information or any other data that would violate HIPAA, GDPR, or other privacy regulations.</p>
            <p>Saver does not require or store patient-identifiable data. Any data entered remains the responsibility of the user.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Collection & Usage</h2>
            <p>We collect and store non-identifiable usage data for analytics and platform improvement.</p>
            <p>We utilize third-party services, including OpenAI API and Google Analytics, which may process non-identifiable data.</p>
            <p>By using our Services, you consent to such data collection and processing practices.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">6. Payment & Subscription</h2>
            <p>Certain features of the platform may require a paid subscription.</p>
            <p>Payments are processed through third-party providers. We do not store payment details.</p>
            <p>Refunds are subject to our refund policy, which is outlined on our website.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">7. User Conduct</h2>
            <p>Users must not misuse the platform or engage in fraudulent, unethical, or illegal activity.</p>
            <p>Users are responsible for maintaining the confidentiality of their accounts.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">8. Modifications & Termination</h2>
            <p>We reserve the right to update these Terms at any time.</p>
            <p>We may suspend or terminate user accounts that violate our Terms or policies.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">9. Disclaimers & Limitations of Liability</h2>
            <p>The platform is provided "as is" without warranties of any kind.</p>
            <p>We are not responsible for damages resulting from the use of our Services.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">10. Contact Us</h2>
            <p>For questions, contact us at: savesuppo@gmail.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
