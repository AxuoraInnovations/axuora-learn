"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { MinimalChatInputBar } from "@/components/dashboard/MinimalChatInputBar";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import type { ClaudeChatInputPayload } from "@/components/chat/ClaudeChatInput";

export interface AIAssistantInterfaceProps {
  userName?: string;
  onSendMessage?: (data: ClaudeChatInputPayload) => void;
  className?: string;
}

export function AIAssistantInterface({
  onSendMessage,
  className,
}: AIAssistantInterfaceProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-[#F7F7F7]",
        className
      )}
    >
      {/* Centered content: heading + input bar */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Announcement badge above title */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <AnimatedBadge text="AxuoraLearn V1.0 Study" color="#22d3ee" />
          </motion.div>
          {/* Single heading: What can I help with? */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8"
          >
            What can I help with?
          </motion.h1>

          {/* Minimal input bar: white, rounded, paperclip + Deep Search + Reason + ... + send */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="w-full"
          >
            {onSendMessage && (
              <MinimalChatInputBar
                placeholder="Ask anything"
                onSendMessage={onSendMessage}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer: small gray disclaimer lines */}
      <div className="shrink-0 py-6 px-4 text-center">
        <p className="text-xs text-gray-500">
          AxuoraLearn can sometimes produce inaccurate responses, so double-checking is crucial.
        </p>
      </div>
    </div>
  );
}
