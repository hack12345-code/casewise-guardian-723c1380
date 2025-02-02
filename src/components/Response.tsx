import { Card } from "@/components/ui/card";

interface ResponseProps {
  response: string;
}

export const Response = ({ response }: ResponseProps) => {
  if (!response) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 p-6 border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Recommended Approach:</h3>
      <div className="prose prose-blue max-w-none">
        {response.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};