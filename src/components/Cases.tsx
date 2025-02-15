
import { Shield, FileText, Scale, Brain } from "lucide-react";

export const Cases = () => {
  const cases = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Avoid Malpractice Lawsuits",
      description: "Get tailored AI-driven guidance to reduce legal risks and improve documentation."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Generate Reports",
      description: "Quickly create or refine professional medical reports."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Advisor",
      description: "Get AI medical and legal advice for patient cases and malpractice prevention."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Regulatory Compliance",
      description: "Ensure alignment with industry standards and best practices. Receive precedent-based insights to ensure better decisions."
    }
  ];

  return (
    <section id="cases-section" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cases.map((item, index) => (
            <div key={index} className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
