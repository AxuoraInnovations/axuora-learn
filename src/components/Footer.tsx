import Link from "next/link";

const mainPagesLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-content mx-auto px-5 md:px-10 pt-12 pb-6">
        {/* Branding and tagline – top left */}
        <div className="mb-10 md:mb-12">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-neutral-dark block"
          >
            AxuoraLearn
          </Link>
          <p className="mt-3 text-theme-7 text-sm leading-relaxed max-w-sm">
            Speed up your exam preparation with AI-powered tools.
          </p>
          <p className="mt-1 text-theme-7 text-sm leading-relaxed max-w-sm">
            Built by teens, for teens.
          </p>
        </div>

        {/* Main Pages + Company – two columns, organised */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 mb-12">
          <div>
            <h4 className="font-bold text-neutral-dark text-sm mb-4">
              Main Pages
            </h4>
            <ul className="space-y-3">
              {mainPagesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${
                      link.href === "/"
                        ? "text-primary font-medium"
                        : "text-theme-7 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-dark text-sm mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-theme-7 hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-neutral-300 w-full" />

        {/* Copyright */}
        <p className="mt-6 text-theme-7 text-sm">
          © AxuoraLearn. 2026 All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
