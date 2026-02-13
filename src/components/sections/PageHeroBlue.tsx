"use client";

import { ReactNode } from "react";

type PageHeroBlueProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeroBlue({ title, description, children }: PageHeroBlueProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 md:py-28"
      style={{ backgroundImage: "url(/hero-bg-blue.png)" }}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/95 md:text-xl">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
