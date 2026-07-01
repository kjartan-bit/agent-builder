"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function ConfigurePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff" }}>

      {/* ── Header ── */}
      <div className="px-8 pt-6 pb-6" style={{ background: "#ffffff", borderBottom: "1px solid var(--color-neutral-200)" }}>
        <nav className="ds-text-sm-semibold relative flex items-center justify-center gap-5">
          <div className="absolute left-0"><Logo /></div>
          <Link href="/" className="transition-colors" style={{ color: "var(--color-primary-700)" }}>
            Create
          </Link>
          <span style={{ color: "var(--color-primary-400)" }}>|</span>
          <Link href="/test" className="transition-colors" style={{ color: "var(--color-primary-700)" }}>
            Test
          </Link>
          <span style={{ color: "var(--color-primary-400)" }}>|</span>
          <span style={{ color: "var(--color-primary-900)" }}>Configure</span>
        </nav>
      </div>

      {/* ── Title bar ── */}
      <div className="px-8 py-6" style={{ background: "#ffffff" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="ds-display-xs-bold" style={{ color: "var(--color-neutral-950)" }}>
            Save. Declare. Integrate.
          </h1>
        </div>
      </div>

      {/* ── Questionnaire iframe ── */}
      <div className="flex-1 px-6 pb-10" style={{ background: "var(--color-neutral-50)" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{
              border: "1.5px solid var(--color-neutral-200)",
              background: "#fff",
              minHeight: 800,
            }}
          >
            <iframe
              src="/orchestration.html"
              className="w-full border-0 block"
              style={{ minHeight: 800 }}
              title="Agent Orchestration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
