"use client";

import Link from "next/link";
import { motion } from "motion/react";

const mainPagesLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10 pt-12 pb-6">
        {/* Desktop: two-column layout like reference – left: brand + tagline, right: Main Pages + Company */}
        <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: AxuoraLearn + tagline */}
          <motion.div
            className="lg:max-w-md lg:shrink-0"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-[#333333] transition-opacity hover:opacity-80 md:text-3xl lg:text-4xl"
            >
              AxuoraLearn
            </Link>
            <p className="mt-4 text-theme-7 text-sm leading-relaxed md:mt-5 md:text-base lg:max-w-sm">
              Speed up your exam preparation with AI-powered tools.
            </p>
            <p className="mt-1 text-theme-7 text-sm leading-relaxed md:text-base lg:max-w-sm">
              Built by teens, for teens.
            </p>
          </motion.div>

          {/* Right: Main Pages + Company – closer to brand on desktop */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h4 className="mb-4 font-bold text-[#333333] text-sm uppercase tracking-wide md:text-base">
                Main Pages
              </h4>
              <ul className="space-y-3">
                {mainPagesLinks.map((link, i) => (
                  <li key={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                    >
                      <Link
                        href={link.href}
                        className={`inline-block text-sm transition-colors duration-200 ${
                          link.href === "/"
                            ? "text-primary font-medium"
                            : "text-theme-7 hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h4 className="mb-4 font-bold text-[#333333] text-sm uppercase tracking-wide md:text-base">
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link, i) => (
                  <li key={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                    >
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-theme-7 transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="mt-10 border-t border-gray-200 md:mt-12 lg:mt-14"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Copyright */}
        <motion.p
          className="mt-6 text-theme-7 text-sm md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          © AxuoraLearn. 2026 All Rights Reserved
        </motion.p>
      </div>
    </footer>
  );
}
