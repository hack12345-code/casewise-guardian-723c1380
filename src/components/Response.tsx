import { Card } from "@/components/ui/card";

interface ResponseProps {
  response: string;
}

export const Response = ({ response }: ResponseProps) => {
  if (!response) return null;

  return (
    <Card className="w-full max-w-5xl mx-auto p-8 bg-transparent border-none shadow-none">
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