"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Preloader from "@/components/Preloader";
import { cn } from "@/lib/utils";

const steps = [
  { id: "personal", title: "About you" },
  { id: "study", title: "Study" },
  { id: "goals", title: "Goals" },
  { id: "time", title: "Time" },
  { id: "preferences", title: "Preferences" },
  { id: "extra", title: "Extra" },
];

const SUBJECT_OPTIONS = ["Mathematics", "Sciences", "English", "Other"];
const EXAM_LEVEL_OPTIONS = ["IGCSE", "SPM", "AS-Level", "A-Level", "Other"];
const GOAL_OPTIONS = [
  { value: "full-marks", label: "Get full marks" },
  { value: "pass", label: "Pass comfortably" },
  { value: "understand", label: "Understand topics deeply" },
];
const HOURS_OPTIONS = [
  { value: "1-5", label: "1–5 hours per week" },
  { value: "5-10", label: "5–10 hours per week" },
  { value: "10+", label: "10+ hours per week" },
];
const STUDY_TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"];
const LANGUAGE_OPTIONS = ["English", "Mandarin", "Malay", "Tamil", "Other"];

type ContentLang = "english" | "mandarin" | "malay" | "tamil";
function getPreferredContentLang(languages: string[]): ContentLang {
  if (!languages.length) return "english";
  if (languages.includes("Mandarin")) return "mandarin";
  if (languages.includes("Malay")) return "malay";
  if (languages.includes("Tamil")) return "tamil";
  return "english";
}

const TRANSLATIONS: Record<
  ContentLang,
  {
    stepTitles: Record<string, string>;
    preferences: { title: string; subtitle: string };
    extra: { title: string; subtitle: string; label: string; placeholder: string };
  }
> = {
  english: {
    stepTitles: { personal: "About you", study: "Study", goals: "Goals", time: "Time", preferences: "Preferences", extra: "Extra" },
    preferences: { title: "Preferences", subtitle: "Preferred language(s) for content" },
    extra: { title: "Anything else?", subtitle: "Optional – tell us more", label: "Additional info", placeholder: "e.g. specific topics, learning style..." },
  },
  mandarin: {
    stepTitles: { personal: "关于你", study: "学习", goals: "目标", time: "时间", preferences: "偏好", extra: "其他" },
    preferences: { title: "语言偏好", subtitle: "您希望内容使用哪种语言？" },
    extra: { title: "还有其他吗？", subtitle: "选填 – 多告诉我们一些", label: "补充信息", placeholder: "例如：具体主题、学习风格…" },
  },
  malay: {
    stepTitles: { personal: "Tentang anda", study: "Kajian", goals: "Matlamat", time: "Masa", preferences: "Pilihan", extra: "Lain" },
    preferences: { title: "Pilihan bahasa", subtitle: "Bahasa pilihan untuk kandungan" },
    extra: { title: "Apa-apa lagi?", subtitle: "Pilihan – beritahu kami lebih", label: "Maklumat tambahan", placeholder: "cth: topik, gaya pembelajaran..." },
  },
  tamil: {
    stepTitles: { personal: "உங்களைப் பற்றி", study: "படிப்பு", goals: "இலக்குகள்", time: "நேரம்", preferences: "விருப்பங்கள்", extra: "மற்றவை" },
    preferences: { title: "மொழி விருப்பம்", subtitle: "உள்ளடக்கத்திற்கான மொழி" },
    extra: { title: "வேறு ஏதாவது?", subtitle: "விரும்பினால் – மேலும் சொல்லுங்கள்", label: "கூடுதல் தகவல்", placeholder: "எ.கா: தலைப்புகள், கற்றல் நடை..." },
  },
};

interface FormData {
  name: string;
  dateOfBirth: string;
  subjects: string[];
  examLevel: string;
  primaryGoal: string;
  hoursPerWeek: string;
  studyTime: string;
  languages: string[];
  additionalInfo: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const initialFormData: FormData = {
  name: "",
  dateOfBirth: "",
  subjects: [],
  examLevel: "",
  primaryGoal: "",
  hoursPerWeek: "",
  studyTime: "",
  languages: [],
  additionalInfo: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "subjects" | "languages", value: string) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      if (arr.includes(value)) return { ...prev, [field]: arr.filter((x) => x !== value) };
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const preferredLang = getPreferredContentLang(formData.languages);
  const stepTitle = (stepId: string) => TRANSLATIONS[preferredLang].stepTitles[stepId as keyof typeof TRANSLATIONS.english.stepTitles] ?? steps.find((s) => s.id === stepId)?.title ?? stepId;

  const goToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // TODO: Save to Supabase profile
    const profile = formData;
    console.log("Onboarding profile:", profile);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowPreloader(true);
    }, 800);
  };

  const handleSkip = () => {
    setShowPreloader(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "";
      case 1:
        return formData.subjects.length > 0 && formData.examLevel !== "";
      case 2:
        return formData.primaryGoal !== "";
      case 3:
        return formData.hoursPerWeek !== "" && formData.studyTime !== "";
      case 4:
        return true;
      default:
        return true;
    }
  };

  if (showPreloader) {
    return <Preloader onComplete={goToDashboard} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="mx-auto w-full max-w-[520px]">
          {/* Progress */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2 flex justify-between">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className={cn(
                      "h-4 w-4 cursor-pointer rounded-full transition-colors duration-300",
                      index < currentStep
                        ? "bg-primary"
                        : index === currentStep
                          ? "bg-primary ring-4 ring-primary/20"
                          : "bg-muted"
                    )}
                    onClick={() => index <= currentStep && setCurrentStep(index)}
                    whileTap={{ scale: 0.95 }}
                  />
                  <span
                    className={cn(
                      "mt-1.5 hidden text-xs sm:block",
                      index === currentStep ? "font-medium text-primary" : "text-muted-foreground"
                    )}
                  >
                    {stepTitle(step.id)}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Card: white, subtle border and shadow (reference style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full rounded-3xl border border-gray-200/90 bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex min-h-[320px] flex-col text-[#1a1a1a]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="flex flex-col"
                >
                  {/* Step 0: Personal */}
                  {currentStep === 0 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">Tell us about yourself</h2>
                        <p className="text-sm text-[#666]">Your name and when you were born</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="name" className="text-[#333]">Full name</Label>
                          <Input
                            id="name"
                            placeholder="e.g. John"
                            value={formData.name}
                            onChange={(e) => updateFormData("name", e.target.value)}
                            className="rounded-xl border-[#e0e0e0] focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="dob" className="text-[#333]">Date of birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                            className="rounded-xl border-[#e0e0e0] focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Step 1: Study */}
                  {currentStep === 1 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">Study profile</h2>
                        <p className="text-sm text-[#666]">Subjects and exam level</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label className="text-[#333]">Which subjects are you focusing on?</Label>
                          <div className="flex flex-wrap gap-2">
                            {SUBJECT_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleArray("subjects", opt)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  formData.subjects.includes(opt)
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#333] hover:bg-[#eee]"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label className="text-[#333]">Exam level</Label>
                          <div className="flex flex-wrap gap-2">
                            {EXAM_LEVEL_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateFormData("examLevel", opt)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  formData.examLevel === opt
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#333] hover:bg-[#eee]"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Step 2: Goals */}
                  {currentStep === 2 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">Goals</h2>
                        <p className="text-sm text-[#666]">What do you want to achieve?</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label className="text-[#333]">Primary goal</Label>
                          <div className="space-y-2">
                            {GOAL_OPTIONS.map((opt) => (
                              <label
                                key={opt.value}
                                className={cn(
                                  "flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-colors",
                                  formData.primaryGoal === opt.value
                                    ? "border-primary bg-primary/10"
                                    : "border-[#e0e0e0] hover:bg-[#f9f9f9]"
                                )}
                              >
                                <input
                                  type="radio"
                                  name="goal"
                                  value={opt.value}
                                  checked={formData.primaryGoal === opt.value}
                                  onChange={() => updateFormData("primaryGoal", opt.value)}
                                  className="h-4 w-4 text-primary"
                                />
                                <span className="text-sm text-[#333]">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Step 3: Time */}
                  {currentStep === 3 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">Time & commitment</h2>
                        <p className="text-sm text-[#666]">How much and when you study</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label className="text-[#333]">Hours per week</Label>
                          <div className="flex flex-wrap gap-2">
                            {HOURS_OPTIONS.map(({ value, label }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => updateFormData("hoursPerWeek", value)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  formData.hoursPerWeek === value
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#333] hover:bg-[#eee]"
                                )}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label className="text-[#333]">When do you prefer to study?</Label>
                          <div className="flex flex-wrap gap-2">
                            {STUDY_TIME_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => updateFormData("studyTime", opt)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  formData.studyTime === opt
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#333] hover:bg-[#eee]"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Step 4: Preferences */}
                  {currentStep === 4 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">{TRANSLATIONS[preferredLang].preferences.title}</h2>
                        <p className="text-sm text-[#666]">{TRANSLATIONS[preferredLang].preferences.subtitle}</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {LANGUAGE_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleArray("languages", opt)}
                                className={cn(
                                  "rounded-full border px-4 py-2 text-sm transition-colors",
                                  formData.languages.includes(opt)
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-[#e0e0e0] bg-[#f5f5f5] text-[#333] hover:bg-[#eee]"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Step 5: Extra */}
                  {currentStep === 5 && (
                    <>
                      <div className="space-y-1.5 p-6 pb-0">
                        <h2 className="text-2xl font-semibold tracking-tight">{TRANSLATIONS[preferredLang].extra.title}</h2>
                        <p className="text-sm text-[#666]">{TRANSLATIONS[preferredLang].extra.subtitle}</p>
                      </div>
                      <div className="space-y-4 p-6">
                        <motion.div variants={fadeInUp} className="space-y-2">
                          <Label htmlFor="extra" className="text-[#333]">{TRANSLATIONS[preferredLang].extra.label}</Label>
                          <textarea
                            id="extra"
                            placeholder={TRANSLATIONS[preferredLang].extra.placeholder}
                            value={formData.additionalInfo}
                            onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                            className="min-h-[80px] w-full rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
                          />
                        </motion.div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer: Back, Next/Submit, Skip */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#eee] p-6 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 rounded-2xl border-[#e0e0e0]"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex items-center gap-3">
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!isStepValid() || isSubmitting}
                      className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>Submit <Check className="h-4 w-4" /></>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-white hover:bg-primary/90 disabled:opacity-60"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}: {stepTitle(steps[currentStep].id)}</p>
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm font-medium text-primary underline hover:text-primary/80"
            >
              Skip for now → go to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
