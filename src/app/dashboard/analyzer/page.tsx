"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, CheckCircle2, AlertCircle, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeAnswer, type AnalysisResult } from "@/lib/api";

export default function AnalyzerPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rubric, setRubric] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!question.trim() || !answer.trim()) return;
    
    setAnalyzing(true);
    try {
      const analysis = await analyzeAnswer(question, answer, rubric || undefined);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze answer. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setQuestion("");
    setAnswer("");
    setRubric("");
  };

  return (
    <div className="min-h-full bg-primary-bg p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Full Marks Analyzer</h1>
          <p className="mt-2 text-[#666]">Get detailed feedback on your exam answers</p>
        </div>

        {!result ? (
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm md:p-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6">
              <div>
                <Label htmlFor="question">Question</Label>
                <textarea
                  id="question"
                  placeholder="Enter the exam question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="mt-2 min-h-[100px] w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={analyzing}
                />
              </div>

              <div>
                <Label htmlFor="answer">Your answer</Label>
                <textarea
                  id="answer"
                  placeholder="Enter your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mt-2 min-h-[150px] w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={analyzing}
                />
              </div>

              <div>
                <Label htmlFor="rubric">Marking rubric (optional)</Label>
                <textarea
                  id="rubric"
                  placeholder="Paste the marking scheme if available..."
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="mt-2 min-h-[80px] w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={analyzing}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !question.trim() || !answer.trim()}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Analyze my answer</>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Score */}
            <motion.div
              className="rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                <span className="text-5xl font-bold text-primary">{result.score}</span>
              </div>
              <p className="mt-4 text-lg font-medium text-[#333]">Your score</p>
            </motion.div>

            {/* Strengths */}
            <motion.div
              className="rounded-2xl border border-green-200 bg-green-50 p-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Strengths</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                    <span className="mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Missing elements */}
            <motion.div
              className="rounded-2xl border border-red-200 bg-red-50 p-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">What's missing</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {result.missing.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                    <span className="mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Improvements */}
            <motion.div
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-blue-700">
                <Lightbulb className="h-5 w-5" />
                <h2 className="text-lg font-semibold">How to improve</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                    <span className="mt-0.5">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Model answer */}
            <motion.div
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Model answer</h2>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#333]">
                {result.model_answer}
              </p>
            </motion.div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Analyze another answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
