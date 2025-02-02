import { 
  Stethoscope, 
  Brain, 
  Heart, 
  Baby, 
  Syringe, 
  Pill, 
  MoreHorizontal 
} from "lucide-react";

export const Sectors = () => {
  const specialties = [
    { icon: <Stethoscope className="w-5 h-5" />, label: "General Practice" },
    { icon: <Brain className="w-5 h-5" />, label: "Neurology" },
    { icon: <Heart className="w-5 h-5" />, label: "Cardiology" },
    { icon: <Baby className="w-5 h-5" />, label: "Pediatrics" },
    { icon: <Syringe className="w-5 h-5" />, label: "Surgery" },
    { icon: <Pill className="w-5 h-5" />, label: "Internal Medicine" },
    { icon: <MoreHorizontal className="w-5 h-5" />, label: "More" },
  ];

  return (
    <div className="flex justify-center gap-6 flex-wrap">
      {specialties.map((specialty, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {specialty.icon}
          <span>{specialty.label}</span>
        </button>
      ))}
    </div>
  );
};