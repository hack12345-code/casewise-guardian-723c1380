
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
            <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
            <p>Saver respects your privacy. This Privacy Policy explains how we collect, use, and protect user data when you use our Services.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">2. Data We Collect</h2>
            <p>Personal Data: We collect email addresses and payment information for account management and billing purposes.</p>
            <p>Usage Data: We collect anonymized analytics data to improve our platform.</p>
            <p>AI Interactions: We process AI-generated responses but do not store user-inputted patient details.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">3. How We Use Your Data</h2>
            <p>To provide and improve our Services.</p>
            <p>To comply with legal obligations and ensure platform security.</p>
            <p>To communicate with users regarding account-related information.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">4. Third-Party Services</h2>
            <p>We use OpenAI API for AI processing and Google Analytics for tracking anonymized user behavior.</p>
            <p>We are not affiliated with OpenAI, Google, or any regulatory body mentioned on our site.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Security</h2>
            <p>We employ security measures to protect user data.</p>
            <p>Users should not input patient-identifiable data, as our platform is not designed for storing protected health information (PHI).</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">6. Data Retention</h2>
            <p>We retain non-identifiable user data for analytics.</p>
            <p>Users may request account deletion by contacting savesuppo@gmail.com.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">7. Your Rights</h2>
            <p>Users can request access, modification, or deletion of their personal data.</p>
            <p>We comply with data protection laws applicable to our operations.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">8. Policy Changes</h2>
            <p>We may update this policy periodically. Users will be notified of significant changes.</p>

            <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Us</h2>
            <p>For privacy-related concerns, email us at: savesuppo@gmail.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
