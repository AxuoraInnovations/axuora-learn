"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractYouTube } from "@/lib/api";

export default function YouTubeExtractorPage() {
  const [url, setUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<{
    videoId: string;
    title: string;
    description?: string;
    transcript: string;
    duration: number;
    thumbnailUrl: string;
    channelTitle?: string;
  } | null>(null);

  const handleExtract = async () => {
    if (!url.trim()) return;
    
    setExtracting(true);
    try {
      const data = await extractYouTube(url);
      setResult(data);
    } catch (error) {
      console.error("Extraction failed:", error);
      alert("Failed to extract YouTube content. Please check the URL and try again.");
    } finally {
      setExtracting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-full bg-primary-bg p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">YouTube Extractor</h1>
          <p className="mt-2 text-[#666]">Extract transcripts from educational videos</p>
        </div>

        {!result ? (
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm md:p-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">YouTube URL</Label>
                <Input
                  id="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={extracting}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleExtract}
                disabled={extracting || !url.trim()}
                className="w-full"
                size="lg"
              >
                {extracting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>Extract transcript</>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Video info */}
            <motion.div
              className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={result.thumbnailUrl}
                alt={result.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#1a1a1a]">{result.title}</h2>
                {result.channelTitle && (
                  <p className="mt-1 text-sm text-[#666]">{result.channelTitle}</p>
                )}
                {result.duration > 0 && (
                  <p className="mt-2 text-sm text-[#888]">Duration: {formatDuration(result.duration)}</p>
                )}
              </div>
            </motion.div>

            {/* Transcript */}
            <motion.div
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1a1a1a]">Transcript</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([result.transcript], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${result.title}-transcript.txt`;
                    a.click();
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto rounded-xl bg-[#f9f9f9] p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#333]">
                  {result.transcript}
                </p>
              </div>
            </motion.div>

            <Button onClick={() => { setResult(null); setUrl(""); }} variant="outline" className="w-full">
              Extract another video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
