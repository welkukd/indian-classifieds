"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="outlined" className="bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <p className="font-medium text-neutral-900">{question}</p>
        {isOpen ? <ChevronUp className="w-5 h-5 text-brand-600" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-neutral-100 animate-slide-down">
          <p className="text-neutral-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </Card>
  );
}