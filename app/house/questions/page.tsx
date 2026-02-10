"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnswerMap = {
  buyerType?: string;
  purpose?: string;
  timing?: string;
  deposit?: string;
};

export default function HouseQuestions() {
  const router = useRouter();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const questions = [
    {
      key: "buyerType",
      text: "Are you planning to buy on your own, or with someone else?",
      options: [
        { label: "On my own", value: "on-my-own" },
        { label: "With a partner", value: "with-partner" },
        { label: "With someone else", value: "with-someone-else" },
        { label: "Not sure yet", value: "not-sure" },
      ],
    },
    {
      key: "purpose",
      text: "Is this home mainly for you to live in, or as an investment?",
      options: [
        { label: "To live in", value: "live-in" },
        { label: "As an investment", value: "investment" },
        { label: "Not sure yet", value: "not-sure" },
      ],
    },
    {
      key: "timing",
      text: "Which best describes where you are right now?",
      options: [
        { label: "Just exploring — no concrete plans yet", value: "exploring" },
        { label: "Thinking about buying in the next year or so", value: "next-year" },
        { label: "Looking seriously and want to move soon", value: "soon" },
        { label: "Already making offers or close to it", value: "active" },
      ],
    },
    {
      key: "deposit",
      text: "Do you already have some savings set aside for a deposit?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "Not yet", value: "not-yet" },
        { label: "Not sure what counts as a deposit", value: "not-sure" },
      ],
    },
  ];

  const currentQuestion = questions[questionIndex];

  function handleContinue() {
    if (!selected) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: selected,
    }));

    setSelected(null);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // All questions answered → move to positioning screen
      router.push("/house/position");
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-sm text-gray-500 mb-4">
          Question {questionIndex + 1} of {questions.length}
        </p>

        <h1 className="text-2xl font-semibold mb-8">
          {currentQuestion.text}
        </h1>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <label key={option.value} className="block cursor-pointer">
              <input
                type="radio"
                name="currentQuestion"
                className="mr-3"
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={handleContinue}
          className={`mt-10 rounded-md px-6 py-3 text-base font-medium ${
            selected
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
