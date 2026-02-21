"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Mic, Square, Play, Pause, Loader2, Download, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AudioLessonsPage() {
  const [topic, setTopic] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const generateLesson = async () => {
    if (!topic.trim()) return;
    
    setGenerating(true);
    try {
      // TODO: Call Text-to-Speech API or Gemini for audio lesson generation
      // Placeholder: simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTranscript(`This is an AI-generated lesson on: ${topic}. 

Key concepts:
1. Introduction to ${topic}
2. Core principles
3. Common applications
4. Practice problems

(Audio generation requires TTS API integration)`);
      
      // In production: generate actual audio and set audioUrl
    } catch (error) {
      console.error("Failed to generate lesson:", error);
      alert("Failed to generate lesson. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-full bg-primary-bg p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Audio Lessons</h1>
          <p className="mt-2 text-[#666]">Record notes or generate AI-powered audio lessons</p>
        </div>

        <div className="space-y-6">
          {/* Generate Lesson */}
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Generate AI lesson</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g. Photosynthesis, Newton's Laws..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={generating}
                />
              </div>
              <Button onClick={generateLesson} disabled={generating || !topic.trim()} className="w-full">
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Generate lesson
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Record Audio */}
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Record your notes</h2>
            <div className="flex flex-col items-center gap-4">
              {!audioUrl ? (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex h-24 w-24 items-center justify-center rounded-full transition-all ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRecording ? (
                    <Square className="h-10 w-10 text-white" />
                  ) : (
                    <Mic className="h-10 w-10 text-white" />
                  )}
                </button>
              ) : (
                <div className="flex w-full flex-col gap-4">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary hover:bg-primary/90"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="ml-1 h-8 w-8 text-white" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setAudioUrl(null)} className="flex-1">
                      Record new
                    </Button>
                    <Button asChild className="flex-1">
                      <a href={audioUrl} download="recording.webm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-center text-sm text-[#666]">
                {isRecording
                  ? "Recording... Click to stop"
                  : audioUrl
                  ? "Recording saved"
                  : "Click to start recording"}
              </p>
            </div>
          </motion.div>

          {/* Transcript */}
          {transcript && (
            <motion.div
              className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Transcript</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#333]">{transcript}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
