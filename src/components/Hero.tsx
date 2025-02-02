import { CaseInput } from "./CaseInput";
import { Response } from "./Response";
import { Sectors } from "./Sectors";
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
    <div className="min-h-screen bg-[#f8f9ff]">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            Protect and <span className="text-blue-600">Guide</span>
          </h1>
          <h2 className="text-5xl font-bold text-[#1a1a1a] mb-6">
            Your Medical Practice
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get AI-powered guidance on preventing malpractice risks. Enter your case details
            and receive professional recommendations for safer patient care.
          </p>
        </div>
        
        <Sectors />
        
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <CaseInput onSubmit={handleSubmit} isLoading={isLoading} />
          <Response response={response} />
        </div>
      </div>
    </div>
  );
};