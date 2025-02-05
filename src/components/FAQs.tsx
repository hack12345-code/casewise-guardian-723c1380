import { HelpCircle } from "lucide-react";

export const FAQs = () => {
  const faqs = [
    {
      question: "How does the AI medical guidance work?",
      answer: "Our AI system analyzes your input using advanced medical knowledge bases and provides evidence-based recommendations while maintaining compliance with medical standards."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes, we implement state-of-the-art encryption and comply with HIPAA regulations to ensure your medical data remains completely secure and confidential."
    },
    {
      question: "Can I integrate this with my existing systems?",
      answer: "Yes, our platform offers API integration capabilities and can be seamlessly integrated with most major EMR/EHR systems."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 technical support, regular training sessions, and dedicated account managers for enterprise clients."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-12">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h2 className="text-4xl font-bold text-center">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};