import { FileText, Shield, Stethoscope, Brain } from "lucide-react";

export const Cases = () => {
  const cases = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Clinical Decision Support",
      description: "Get AI-powered guidance for complex medical cases and treatment plans."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Management",
      description: "Identify and mitigate potential medical risks before they become issues."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation Assistant",
      description: "Streamline medical documentation with AI-powered assistance."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Learning & Development",
      description: "Continuous learning from real cases and expert insights."
    }
  ];

  return (
    <section id="cases-section" className="py-20 bg-white">
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
