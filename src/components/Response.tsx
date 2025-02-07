
import { Card } from "@/components/ui/card";

interface ResponseProps {
  response: string;
}

export const Response = ({ response }: ResponseProps) => {
  if (!response) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Enter your case details to get professional guidance
      </div>
    );
  }

  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">Recommended Approach:</h3>
      <div className="prose prose-blue max-w-none">
        {response.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};
