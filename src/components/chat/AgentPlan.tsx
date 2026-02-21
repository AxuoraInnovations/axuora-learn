"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

export interface AgentSubtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[];
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: AgentSubtask[];
}

interface AgentPlanProps {
  tasks: AgentTask[];
  completed?: boolean;
  onComplete?: () => void;
}

export function AgentPlan({ tasks, completed = false }: AgentPlanProps) {
  const [expandedTasks, setExpandedTasks] = useState<string[]>(
    tasks.length > 0 ? [tasks[0].id] : []
  );
  const [expandedSubtasks, setExpandedSubtasks] = useState<{
    [key: string]: boolean;
  }>({});

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const taskVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
  };

  const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: {
      height: "auto",
      opacity: 1,
      overflow: "visible",
      transition: {
        duration: 0.25,
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren",
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: { duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  const subtaskVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: { opacity: 0, x: prefersReducedMotion ? 0 : -10, transition: { duration: 0.15 } },
  };

  const statusBadgeClass = (status: string) =>
    status === "completed"
      ? "bg-green-100 text-green-700"
      : status === "in-progress"
        ? "bg-blue-100 text-blue-700"
        : status === "need-help"
          ? "bg-yellow-100 text-yellow-700"
          : status === "failed"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600";

  const StatusIcon = ({
    status,
    size = "4.5",
  }: {
    status: string;
    size?: "3.5" | "4.5";
  }) => {
    const c = size === "3.5" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
    if (status === "completed") return <CheckCircle2 className={`${c} text-green-500`} />;
    if (status === "in-progress") return <CircleDotDashed className={`${c} text-blue-500`} />;
    if (status === "need-help") return <CircleAlert className={`${c} text-yellow-500`} />;
    if (status === "failed") return <CircleX className={`${c} text-red-500`} />;
    return <Circle className={`text-gray-400 ${c}`} />;
  };

  return (
    <div className="bg-[#F7F7F7] text-gray-900 rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
      {completed && (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-b border-green-200/60 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Plan completed</span>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
      >
        <LayoutGroup>
          <div className="p-4 overflow-hidden">
            <ul className="space-y-1 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className={index !== 0 ? "mt-1 pt-2" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    <motion.div
                      className="group flex items-center px-3 py-1.5 rounded-md"
                      whileHover={{
                        backgroundColor: "rgba(0,0,0,0.03)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="mr-2 flex-shrink-0">
                        <StatusIcon status={task.status} />
                      </div>
                      <div
                        className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-2 flex-1 truncate">
                          <span
                            className={
                              isCompleted ? "text-gray-500 line-through" : ""
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                          {task.dependencies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mr-2">
                              {task.dependencies.map((dep, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-200/80 text-gray-700 rounded px-1.5 py-0.5 text-[10px] font-medium"
                                >
                                  {dep}
                                </span>
                              ))}
                            </div>
                          )}
                          <span
                            className={`rounded px-1.5 py-0.5 ${statusBadgeClass(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div
                          className="relative overflow-hidden"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="absolute top-0 bottom-0 left-[20px] border-l-2 border-dashed border-gray-300/80" />
                          <ul className="mt-1 mr-2 mb-1.5 ml-3 space-y-0.5">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`;
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-6"
                                  onClick={() =>
                                    toggleSubtaskExpansion(task.id, subtask.id)
                                  }
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <div className="flex flex-1 items-center rounded-md p-1">
                                    <div className="mr-2 flex-shrink-0">
                                      <StatusIcon status={subtask.status} size="3.5" />
                                    </div>
                                    <span
                                      className={`cursor-pointer text-sm ${
                                        subtask.status === "completed"
                                          ? "text-gray-500 line-through"
                                          : ""
                                      }`}
                                    >
                                      {subtask.title}
                                    </span>
                                  </div>
                                  <AnimatePresence mode="wait">
                                    {isSubtaskExpanded && (
                                      <motion.div
                                        className="text-gray-500 border-gray-300/60 mt-1 ml-1.5 border-l border-dashed pl-5 text-xs overflow-hidden"
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mt-0.5 mb-1 flex flex-wrap items-center gap-1.5">
                                            <span className="font-medium">MCP Servers:</span>
                                            <div className="flex flex-wrap gap-1">
                                              {subtask.tools.map((tool, idx) => (
                                                <span
                                                  key={idx}
                                                  className="bg-gray-200/80 text-gray-700 rounded px-1.5 py-0.5 text-[10px] font-medium"
                                                >
                                                  {tool}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
