"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="bg-white border-b border-neutral-200 px-6 h-14 flex items-center justify-between shrink-0">
      <span className="font-bold text-primary-800" style={{ fontSize: 16 }}>
        11sight
      </span>
      <div className="flex gap-1">
        {[
          { href: "/", label: "Agent Builder" },
          { href: "/test", label: "Test Agent" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              path === href
                ? "bg-primary-50 text-primary-700"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
            style={{ fontSize: 14 }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
