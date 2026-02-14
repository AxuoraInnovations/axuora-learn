"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { BarChart3, BookOpen, CheckCheck, FileQuestion, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for students getting started with exam prep. Try AI-generated questions and basic analytics.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get started free",
    buttonVariant: "outline" as const,
    features: [
      { text: "Up to 50 AI exam questions per month", icon: <FileQuestion size={20} /> },
      { text: "Up to 5 past papers uploads", icon: <BookOpen size={20} /> },
      { text: "Basic full-marks breakdown", icon: <Sparkles size={20} /> },
    ],
    includes: [
      "Free includes:",
      "AI predictive exam questions",
      "Step-by-step answer breakdown",
      "1 subject of your choice",
    ],
  },
  {
    name: "Pro",
    description:
      "Best for serious students. Unlimited AI questions, weekly performance tracking, and all subjects.",
    price: 50,
    yearlyPrice: 540,
    currency: "RM",
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Unlimited AI exam questions", icon: <FileQuestion size={20} /> },
      { text: "Unlimited past papers & storage", icon: <BookOpen size={20} /> },
      { text: "Weekly performance tracker", icon: <BarChart3 size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "All subjects supported",
      "Monthly progress reports",
      "Priority support",
    ],
  },
  {
    name: "Pro Plus",
    description:
      "For students who want everything. Unlimited access, team features, and premium support.",
    comingSoon: true,
    price: null,
    yearlyPrice: null,
    buttonText: "Coming Soon",
    buttonVariant: "outline" as const,
    features: [
      { text: "Coming Soon", icon: <Sparkles size={20} /> },
      { text: "Coming Soon", icon: <BookOpen size={20} /> },
      { text: "Coming Soon", icon: <BarChart3 size={20} /> },
    ],
    includes: [
      "Everything in Pro, plus:",
      "Study group sharing",
      "Export reports & PDFs",
      "Dedicated support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-50 mx-auto flex w-fit rounded-full border border-gray-200 bg-neutral-50 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 h-10 w-fit rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === "0"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId="switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-blue-600 from-blue-500 via-blue-400 to-blue-600 shadow-sm shadow-blue-600 bg-gradient-to-t sm:h-12"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 flex-shrink-0 rounded-full px-3 py-1 font-medium transition-colors sm:h-12 sm:px-6 sm:py-2 ${
            selected === "1"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId="switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full border-4 border-blue-600 from-blue-500 via-blue-400 to-blue-600 shadow-sm shadow-blue-600 bg-gradient-to-t sm:h-12"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-black">
              Save 10%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="relative mx-auto min-h-0 bg-white px-4 pt-12 pb-20"
      ref={sectionRef}
    >
      <div className="mb-6 max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-medium text-gray-900 mb-4 sm:text-4xl md:text-6xl"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          Plan that works best for your{" "}
          <span className="inline-block rounded-xl border border-dashed border-blue-500 bg-blue-100 px-2 py-1 capitalize">
            Exams
          </span>
        </motion.h2>
        <motion.p
          className="mx-auto text-sm text-gray-600 sm:text-base w-[80%] sm:w-[70%]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={1}
        >
          Choose the plan that fits your study goals. Explore which option is right for you.
        </motion.p>
      </div>

      <motion.div
        className="relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        custom={2}
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-4 py-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            custom={index}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="transition-shadow"
          >
            <Card
              className={`relative border-neutral-200 ${
                plan.popular
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "bg-white "
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="mb-2 text-3xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-600">{plan.description}</p>
                <div className="flex items-baseline">
                  {"comingSoon" in plan && plan.comingSoon ? (
                    <span className="text-4xl font-semibold text-gray-900">
                      Coming Soon
                    </span>
                  ) : (isYearly ? plan.yearlyPrice : plan.price) === 0 ? (
                    <span className="text-4xl font-semibold text-gray-900">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold text-gray-900">
                        {"currency" in plan && plan.currency ? plan.currency + " " : "$"}
                        <NumberFlow
                          value={(isYearly ? plan.yearlyPrice : plan.price) ?? 0}
                          className="text-4xl font-semibold"
                        />
                      </span>
                      <span className="ml-1 text-gray-600">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`mb-6 w-full rounded-xl p-4 text-xl ${
                    plan.popular
                      ? "border border-blue-400 from-blue-500 to-blue-600 bg-gradient-to-t text-white shadow-lg shadow-blue-500"
                      : plan.buttonVariant === "outline"
                        ? "border border-neutral-700 from-neutral-900 to-neutral-600 bg-gradient-to-t text-white shadow-lg shadow-neutral-900"
                        : ""
                  }`}
                >
                  {plan.buttonText}
                </button>
                <ul className="space-y-2 py-5 font-semibold">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="mt-0.5 mr-3 grid place-content-center text-neutral-800">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-gray-600">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-neutral-200 pt-4">
                  <h4 className="mb-3 text-base font-medium text-gray-900">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="mt-0.5 mr-3 grid h-6 w-6 place-content-center rounded-full border border-blue-500 bg-green-50">
                          <CheckCheck className="h-4 w-4 text-blue-500 " />
                        </span>
                        <span className="text-sm text-gray-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
