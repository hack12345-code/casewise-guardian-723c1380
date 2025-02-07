
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ResponseProps {
  response: string;
  prompt?: string;
  caseTitle?: string;
  onRename?: (newTitle: string) => void;
}

export const Response = ({ response, prompt, caseTitle, onRename }: ResponseProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(caseTitle || "");

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Enter your case details to get professional guidance
      </div>
    );
  }

  const handleRename = () => {
    if (onRename) {
      onRename(newTitle);
      setIsEditing(false);
    }
  };

  return (
    <Card className="w-full bg-transparent border-none shadow-none">
      <div className="flex items-center justify-between mb-6">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="max-w-[300px]"
              placeholder="Enter case name..."
            />
            <Button onClick={handleRename} variant="outline" size="sm">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-gray-900">{caseTitle}</h3>
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="ml-2"
            >
              Rename
            </Button>
          </div>
        )}
      </div>

      {prompt && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Prompt:</h4>
          <p className="text-gray-700">{prompt}</p>
        </div>
      )}

      <div className="prose prose-blue max-w-none">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Response:</h4>
        {response.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};
