import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};