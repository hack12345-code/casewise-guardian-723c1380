import { CaseInput } from "./CaseInput";
import { Response } from "./Response";
import { useState } from "react";

export const Hero = () => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (caseDetails: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert in medical malpractice prevention. Provide clear, professional guidance to doctors on how to handle patient cases while minimizing legal risks. Focus on communication, documentation, and best practices."
            },
            {
              role: "user",
              content: caseDetails
            }
          ],
        }),
      });

      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Malpractice Prevention Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your case details below to receive guidance on preventing malpractice risks
          </p>
        </div>
        
        <CaseInput onSubmit={handleSubmit} isLoading={isLoading} />
        <Response response={response} />
      </div>
    </div>
  );
};