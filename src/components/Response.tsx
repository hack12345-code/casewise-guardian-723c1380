import { Card } from "@/components/ui/card";

interface ResponseProps {
  response: string;
}

export const Response = ({ response }: ResponseProps) => {
  if (!response) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 p-6">
      <h3 className="text-xl font-semibold mb-4">Recommended Response:</h3>
      <div className="prose prose-blue">
        {response.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};